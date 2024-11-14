"use client";

import StatCard from '@/components/common/statCard'
import React, { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import Header from '@/components/common/header'
import axios from 'axios'
import { HEADER } from '@/constants/constant';
import AudioGraph from '@/components/page-components/audioGraph';
import { DataTable } from '../history/page';
import { GridColDef } from '@mui/x-data-grid';
import { Modal, Typography, Box } from '@mui/material';


type Props = {}
const columns: GridColDef[] = [
    { field: 'id', headerName: 'ID', flex: 1 / 2 },
    { field: 'filename', headerName: 'File name', flex: 2 },
    { field: 'uploadDate', headerName: 'Upload Date', flex: 1 },
];

const paginationModel = { page: 0, pageSize: 5 };

function AudioPredictionPage({ }: Props) {

    const [selectedRowData, setSelectedRowData] = useState<any>({});
    const [audioListDataArray, setAudioListDataArray] = useState<any[]>([])
    const [error, setError] = useState<any>("")
    const [modalOpen, setModalOpen] = useState<boolean>(false);
    const [audioFileUrl, setAudioFileUrl] = useState<any>()

    useEffect(() => {
        getAudioPredictionFileList()
    }, [])

    function formatISOToCustomDate(isoDate: string) {
        const date = new Date(isoDate);
        const day = String(date.getUTCDate()).padStart(2, '0');
        const month = String(date.getUTCMonth() + 1).padStart(2, '0');
        const year = date.getUTCFullYear();
        const hours = String(date.getUTCHours()).padStart(2, '0');
        const minutes = String(date.getUTCMinutes()).padStart(2, '0');
        return `${day}/${month}/${year} ${hours}:${minutes}`;
    }

    const getAudioPredictionFileList = async () => {
        try {
            const resAudioList = await axios.get('https://3e2c-49-237-36-69.ngrok-free.app/list/audio', { headers: HEADER.headers })
            console.log(resAudioList.data)
            if (resAudioList.status === 200 && resAudioList.status) {
                setAudioListDataArray((prevData) => {
                    const updatedData = [
                        ...prevData,
                        ...resAudioList.data.map((item: any, index: number) => ({
                            ...item,
                            uploadDate: formatISOToCustomDate(item.uploadDate),
                        }))
                    ];
                    console.log(updatedData)
                    return updatedData;
                });
            }
            setError("")
        } catch (error) {
            console.log(error);
            setError(error);
        }
    }

    const getAudioPredictionFile = async (fileName: string) => {
        const file = fileName;

        const downloadAudio = (audioUrl: string) => {
            const link = document.createElement('a');
            link.href = audioUrl;
            link.download = fileName;
            link.click();
        };

        try {
            const resGetAudioFile = await axios.get(
                'https://3e2c-49-237-36-69.ngrok-free.app/audio/' + file,
                {
                    responseType: 'blob',
                    headers: {
                        "ngrok-skip-browser-warning": "69420",
                        "Content-Type": "application/json"
                    },
                }
            );

            if (resGetAudioFile.status === 200 && resGetAudioFile.data) {
                const audioBlob = new Blob([resGetAudioFile.data], { type: 'audio/wav' });
                const audioUrl = URL.createObjectURL(audioBlob);
                downloadAudio(audioUrl);
                const audio = new Audio(audioUrl);
                // audio.load();
                // audio.play();
                console.log(resGetAudioFile.data, "dadwda")
                console.log(audioUrl);
                console.log(audio);
                

                // console.log("Audio file loaded and playing", resGetAudioFile.data);

                setAudioFileUrl(audioUrl);
                setModalOpen(false);
            }

            setError("");
        } catch (error) {
            console.error("Error fetching the audio file", error);
            setError(error || "Failed to load the audio file");
        }
    }


    const handleSelectionModelChange = (selection: any) => {
        if (selection.length > 0) {
            const selectedId = selection[0];
            const selectedRow = audioListDataArray.find((row: any) => row.id === selectedId);
            console.log(selectedRow);
            setSelectedRowData(selectedRow);
            setModalOpen(true);
        } else {
            setSelectedRowData(null);
        }
    };

    return (
        <div className="flex-1 overflow-auto relative z-10">
            <Header title="AUDIO PREDICTION PAGE" />
            <main className=" max-w-7xl mx-auto py-6 px-4 lg:px-8">
                <Modal
                    open={modalOpen}
                    onClose={() => setModalOpen(false)}
                    aria-labelledby="modal-modal-title"
                    aria-describedby="modal-modal-description"
                >
                    <Box
                        sx={{
                            position: 'absolute',
                            top: '50%',
                            left: '50%',
                            transform: 'translate(-50%, -50%)',
                            width: 400,
                            bgcolor: '#334155',
                            borderRadius: '15px',
                            boxShadow: 24,
                            p: 4,
                        }}
                    >
                        <Typography id="modal-title" component="h2" className="text-xl font-extrabold text-white mb-4">
                            Are you sure?
                        </Typography>
                        <Typography id="modal-description" className="text-gray-300 mb-6">
                            Do you want to select this file? {selectedRowData.filename ? selectedRowData.filename : ""}
                        </Typography>
                        <div className="flex justify-end space-x-4">
                            <button
                                onClick={() => getAudioPredictionFile(selectedRowData.filename)}
                                className="px-4 py-2 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
                            >
                                Yes
                            </button>
                            <button
                                onClick={() => setModalOpen(false)}
                                className="px-4 py-2 bg-gray-600 text-white font-semibold rounded-lg hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-gray-500"
                            >
                                No
                            </button>
                        </div>
                    </Box>
                </Modal>
                {!true ?
                    <div className="p-4 rounded-md bg-slate-700 text-red-500">
                        <h1>Error connecting. Please try again.</h1>
                    </div>
                    :
                    <>
                        <div
                            className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4 mb-8"
                        >
                            {/* <StatCard name="Machine ID" icon={MonitorCog} value={"M001EF"} color="#F59E0B" />
                            <StatCard name="Machine Cycle" icon={Recycle} value={lifeCycle} color="#6366F1" /> */}
                        </div>

                        <div className="grid grid-cols-1 gap-8">
                            <AudioGraph file={audioFileUrl} />
                            <div className="lg:col-span-2 bg-gray-800 bg-opacity-50 backdrop-blur-md shadow-lg rounded-xl p-4 border border-gray-700">
                                <h2 className="text-lg font-extrabold mb-4 text-gray-100">Audio file list</h2>
                                <DataTable rows={audioListDataArray} columns={columns} paginationModel={paginationModel} onSelectionModelChange={handleSelectionModelChange} />
                            </div>
                        </div>
                    </>
                }
            </main>
        </div>
    )
}

export default AudioPredictionPage