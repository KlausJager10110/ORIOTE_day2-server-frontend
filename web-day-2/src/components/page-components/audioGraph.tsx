import React, { useState, useRef, useEffect } from 'react'
import WaveSurfer from 'wavesurfer.js'
import RegionsPlugin from 'wavesurfer.js/dist/plugins/regions.esm.js'

type Props = {
    file?: any;
}

const WaveformPlayer = ({ file }: Props) => {
    const [zoomLevel, setZoomLevel] = useState<number>(100)
    const [isPlaying, setIsPlaying] = useState<boolean>(false)
    const [audioReady, setAudioReady] = useState<boolean>(false)  // Track audio ready state

    const waveformRef = useRef<HTMLDivElement>(null)
    const wavesurferRef = useRef<WaveSurfer | null>(null)

    // Initialize WaveSurfer
    const initializeWaveSurfer = () => {
        if (waveformRef.current && !wavesurferRef.current) {
            const regions = RegionsPlugin.create()

            const wavesurfer = WaveSurfer.create({
                container: waveformRef.current,
                waveColor: 'rgb(255, 255, 255)',
                progressColor: 'rgb(100, 100, 100)',
                url: file ? window.URL.createObjectURL(file) : "./.wav/RunningAudio.wav",
                minPxPerSec: zoomLevel, // Set initial zoom level
                dragToSeek: true,
            })



            wavesurferRef.current = wavesurfer


            wavesurfer.on('ready', () => {
                setAudioReady(true)  // Set audio ready to true once the audio is loaded
                wavesurfer.zoom(zoomLevel)  // Apply the initial zoom once the audio is ready
            })
        }
    }

    // Call the initialization function immediately
    useEffect(() => {
        if (file || !wavesurferRef.current) {
            console.log(file, "ffff");

            initializeWaveSurfer()
        }
        return () => {
            if (wavesurferRef.current) {
                wavesurferRef.current.destroy();
            }
        };
    }, [file])

    // Handle play/pause toggle
    const handlePlayPause = () => {
        setIsPlaying((prev) => {
            const newState = !prev
            if (wavesurferRef.current) {
                if (newState) wavesurferRef.current.play()
                else wavesurferRef.current.pause()
            }
            return newState
        })
    }

    // Handle zoom control
    const handleZoomChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const newZoomLevel = Number(e.target.value)
        setZoomLevel(newZoomLevel)
        if (audioReady && wavesurferRef.current) {
            wavesurferRef.current.zoom(newZoomLevel)
        }
    }

    // Forward and backward skip handlers
    const handleSkip = (seconds: number) => {
        if (wavesurferRef.current) {
            wavesurferRef.current.skip(seconds)
        }
    }

    return (
        <div className='bg-gray-800 bg-opacity-50 backdrop-blur-md shadow-lg rounded-xl p-6 border border-gray-700'>
            <div className="bg-gray-800 bg-opacity-50 backdrop-blur-md shadow-lg rounded-xl p-6 border border-gray-700">
                <div
                    ref={waveformRef}
                    style={{
                        width: '100%',
                        height: '100%',
                        overflowY: 'hidden',
                        scrollbarWidth: 'thin',
                        scrollbarColor: '#888 #ccc',
                    }}
                ></div>
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
                {/* Play/Pause, Forward/Backward buttons */}
                <div
                    className='flex flex-row gap-3 justify-center items-center'
                >
                    <button className="p-[3px] relative" onClick={handlePlayPause}>
                        <div className="absolute inset-0 bg-gradient-to-r from-indigo-500 to-purple-500 rounded-lg" />
                        <div className="px-8 py-2  bg-gray-600 rounded-[6px]  relative group transition duration-200 text-white hover:bg-transparent">
                            {isPlaying ? 'Pause' : 'Play'}
                        </div>
                    </button>
                    <button className="p-[3px] relative" onClick={() => handleSkip(5)}>
                        <div className="absolute inset-0 bg-gradient-to-r from-indigo-500 to-purple-500 rounded-lg" />
                        <div className="px-4 py-2  bg-gray-600 rounded-[6px]  relative group transition duration-200 text-white hover:bg-transparent">
                            Forward 5s
                        </div>
                    </button>
                    <button className="p-[3px] relative" onClick={() => handleSkip(-5)}>
                        <div className="absolute inset-0 bg-gradient-to-r from-indigo-500 to-purple-500 rounded-lg" />
                        <div className="px-4 py-2  bg-gray-600 rounded-[6px]  relative group transition duration-200 text-white hover:bg-transparent">
                            Backward 5s
                        </div>
                    </button>
                </div>
            </div>


        </div>
    )
}

export default WaveformPlayer
