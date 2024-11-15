import { red } from '@mui/material/colors';
import React, { useState, useRef, useEffect } from 'react';
import WaveSurfer from 'wavesurfer.js';
import RegionsPlugin from 'wavesurfer.js/dist/plugins/regions.esm.js';

type Props = {
    file?: any;
    data?: any;
};

const WaveformPlayer = ({ file, data }: Props) => {
    const [zoomLevel, setZoomLevel] = useState<number>(100);
    const [isPlaying, setIsPlaying] = useState<boolean>(false);
    const [audioReady, setAudioReady] = useState<boolean>(false); // Track audio ready state
    // const [startTime, setStartTime] = useState<number>(0);
    // const [endTime, setEndTime] = useState<number>(0.5);
    const [dataFile, setDataFile] = useState<any>({})

    const waveformRef = useRef<any>(null);
    const wavesurferRef = useRef<WaveSurfer | null>(null);

    // Initialize WaveSurfer
    const initializeWaveSurfer = (fileN: any) => {
        if (fileN || (waveformRef.current && !wavesurferRef.current)) {
            console.log('initializeWaveSurfer tricker');
            const regions = RegionsPlugin.create();
            const wavesurfer = WaveSurfer.create({
                container: waveformRef.current,
                waveColor: 'rgb(255, 255, 255)',
                progressColor: 'rgb(100, 100, 100)',
                url: fileN && fileN,
                minPxPerSec: zoomLevel,
                dragToSeek: true,
                mediaControls: true,
                hideScrollbar: false,
                plugins: [regions],
            });

            if (fileN instanceof Blob) {
                wavesurfer.loadBlob(fileN);
            } else if (typeof fileN === 'string') {
                wavesurfer.load(fileN);
            }

            wavesurferRef.current = wavesurfer;

            wavesurfer.on('ready', () => {
                setAudioReady(true);
                wavesurfer.zoom(zoomLevel);
            });
            wavesurfer.on('decode', () => {
                regions.addRegion({
                    start: dataFile.metadata?.duration?.start,
                    end: dataFile.metadata?.duration?.stop || null,
                    content: dataFile.metadata?.tags[0],
                    color: dataFile.metadata?.tags[0] === 'normal' ? 'rgba(0, 255, 0, 0.3)' : 'rgba(255, 0, 0, 0.3)',
                    drag: false,
                    resize: false,
                });
                // regions.addRegion({
                //     start: 0.9,
                //     end: 0.8,
                //     content: 'awdwd',
                //     color: 'rgba(0, 255, 0, 0.5)',
                //     drag: false,
                //     resize: true,
                // });
            });
            // Add event listener to reset the play button after playback ends
            wavesurfer.on('finish', () => {
                setIsPlaying(false); // Reset the play/pause button state
            });
        }
    };

    useEffect(() => {
        if (file || !wavesurferRef.current) {
            console.log(file, 'ffff');
            initializeWaveSurfer(file);
        }
        return () => {
            if (wavesurferRef.current) {
                wavesurferRef.current.destroy();
            }
        };
        setDataFile(data)
    }, [file, data]);

    // Handle play/pause toggle
    const handlePlayPause = () => {
        setIsPlaying((prev) => {
            const newState = !prev;
            if (wavesurferRef.current) {
                if (newState) {
                    wavesurferRef.current.play();
                } else {
                    wavesurferRef.current.pause();
                }
            }
            return newState;
        });
    };

    // Handle zoom control
    const handleZoomChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const newZoomLevel = Number(e.target.value);
        setZoomLevel(newZoomLevel);
        if (audioReady && wavesurferRef.current) {
            wavesurferRef.current.zoom(newZoomLevel);
        }
    };

    return (
        <div className="bg-gray-800 bg-opacity-50 backdrop-blur-md shadow-lg rounded-xl p-6 border border-gray-700">
            <div className="bg-gray-800 bg-opacity-50 backdrop-blur-md shadow-lg rounded-xl p-6 border border-gray-700">
                {file ? (
                    <div
                        ref={waveformRef}
                        style={{
                            width: '100%',
                            height: '100%',
                            overflowY: 'hidden',
                        }}
                    ></div>
                ) : (
                    'Please select a file'
                )}
            </div>

            {/* Zoom control */}
            <div className="mt-4 flex flex-row justify-between items-center bg-gray-800 bg-opacity-50 backdrop-blur-md shadow-lg rounded-xl p-6 border border-gray-700">
                <label className="flex flex-row gap-3">
                    <span>Zoom:</span>
                    <input
                        type="range"
                        min="10"
                        max="1000"
                        value={zoomLevel}
                        onChange={handleZoomChange}
                    />
                </label>
                {/* Play/Pause button */}
                <div className="flex flex-row gap-3 justify-center items-center">
                    <button className="p-[3px] relative" onClick={handlePlayPause}>
                        <div className="absolute inset-0 bg-gradient-to-r from-indigo-500 to-purple-500 rounded-lg" />
                        <div className="px-8 py-2 bg-gray-600 rounded-[6px] relative group transition duration-200 text-white hover:bg-transparent">
                            {isPlaying ? 'Pause' : 'Play'}
                        </div>
                    </button>
                </div>
            </div>
        </div>
    );
};

export default WaveformPlayer;
