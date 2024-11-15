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
import LoadAudio from '@/components/page-components/loadAudio';
import { Trash2 } from 'lucide-react';


type Props = {}
const columns: GridColDef[] = [
    { field: '_id', headerName: 'ID', flex: 1 / 2 },
    { field: 'filename', headerName: 'File name', flex: 2 },
    { field: 'uploadDate', headerName: 'Upload Date', flex: 1 },
];

const paginationModel = { page: 0, pageSize: 5 };

function AudioPredictionPage({ }: Props) {

    const [selectedRowData, setSelectedRowData] = useState<any>({});
    const [audioListDataArray, setAudioListDataArray] = useState<any[]>([])
    const [error, setError] = useState<any>("")
    const [modalOpen, setModalOpen] = useState<boolean>(false);
    const [modalDeleteRecheckOpen, setModalDeleteRecheckOpen] = useState<boolean>(false);

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
                            _id: index + 1,
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


    const deleteAudioFile = async (fileName: string) => {
        try {
            const res = await axios.delete('https://3e2c-49-237-36-69.ngrok-free.app/audio/' + fileName, { headers: HEADER.headers });
            if (res.status === 200) {
                console.log("Delete audio file success");
                deleteFromIndexedDB(fileName);

                // ลบไฟล์ออกจาก state โดยตรง
                setAudioListDataArray((prevData) => prevData.filter(item => item.fileName !== fileName));

                // รีเฟรชหน้า
                window.location.reload();

                setModalOpen(false);
            }
        } catch (error) {
            setError(error || "error");
        }
    }

    const deleteFromIndexedDB = (fileName: string) => {
        const request = indexedDB.open('audioDatabase2', 1); // ชื่อฐานข้อมูลและเวอร์ชันที่ใช้

        request.onsuccess = (event: any) => {
            const db = event.target.result;
            const transaction = db.transaction(['audioFiles'], 'readwrite'); // ชื่อ object store
            const objectStore = transaction.objectStore('audioFiles');

            const deleteRequest = objectStore.delete(fileName); // ใช้ชื่อไฟล์หรือ key ที่ใช้ในการลบข้อมูล

            deleteRequest.onsuccess = () => {
                console.log(`Deleted file ${fileName} from IndexedDB`);
            };

            deleteRequest.onerror = (error: any) => {
                console.error(`Failed to delete file from IndexedDB: ${error}`);
            };
        };

        request.onerror = (error) => {
            console.error(`Failed to open IndexedDB: ${error}`);
        };
    };

    const saveToIndexedDB = (fileName: any, fileData: any) => {
        const request = indexedDB.open('audioDatabase2', 1);
        request.onupgradeneeded = (event: any) => {
            const db = event.target.result;
            // สร้าง object store สำหรับเก็บไฟล์ audio
            if (!db.objectStoreNames.contains('audioFiles')) {
                db.createObjectStore('audioFiles', { keyPath: 'fileName' });
            }
        };

        request.onsuccess = (event: any) => {
            const db = event.target.result;
            const transaction = db.transaction('audioFiles', 'readwrite');
            const store = transaction.objectStore('audioFiles');
            store.put({ fileName, fileData }); // เก็บไฟล์ใน IndexedDB

            transaction.oncomplete = () => {
                console.log('File saved to IndexedDB successfully!');
            };

            transaction.onerror = (error: any) => {
                console.error('Error saving file to IndexedDB', error);
            };
        };

        request.onerror = (error) => {
            console.error('Error opening IndexedDB', error);
        };
    };

    const getAudioPredictionFile = async (fileName: any) => {
        const file = fileName;

        try {
            const resGetAudioFile = await axios.get(
                'https://3e2c-49-237-36-69.ngrok-free.app/audio/' + file,
                {
                    responseType: 'blob',
                    headers: {
                        'x-api-key': `dec31bef-27ca-4144-83ed-c25ed8aeb570`,
                        "ngrok-skip-browser-warning": "69420",
                        "Content-Type": "audio/wav",
                    },
                }
            );

            if (resGetAudioFile.status === 200 && resGetAudioFile.data) {
                const audioBlob = new Blob([resGetAudioFile.data], { type: 'audio/wav' });

                // เก็บไฟล์ใน IndexedDB
                saveToIndexedDB(fileName, audioBlob);

                // สร้าง URL สำหรับเล่นไฟล์
                const audioUrl = URL.createObjectURL(audioBlob);
                const audio = new Audio(audioUrl);

                // console.log(resGetAudioFile.data, "dadwda")
                console.log("res", resGetAudioFile.data);
                console.log("url", audioUrl);
                console.log("blob", audioBlob);
                console.log('audio', audio);

                // setAudioFileUrl(audioUrl); // หรือเก็บ URL สำหรับใช้งาน
                setModalOpen(false);
            }

            setError("");
        } catch (error) {
            console.error("Error fetching the audio file", error);
            setError(error || "Failed to load the audio file");
        }
    };


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


    const loadFromIndexedDB = (fileName: any) => {
        return new Promise((resolve, reject) => {
            const request = indexedDB.open('audioDatabase2', 1);

            request.onsuccess = (event: any) => {
                const db = event.target.result;
                const transaction = db.transaction('audioFiles', 'readonly');
                const store = transaction.objectStore('audioFiles');
                const getRequest = store.get(fileName);

                getRequest.onsuccess = () => {
                    if (getRequest.result) {
                        const fileData = getRequest.result.fileData;
                        const audioUrl = URL.createObjectURL(fileData);
                        resolve(audioUrl);
                    } else {
                        reject("File not found in IndexedDB");
                    }
                };

                getRequest.onerror = () => {
                    reject("Error retrieving file from IndexedDB");
                };
            };

            request.onerror = () => {
                reject("Error opening IndexedDB");
            };
        });
    };

    const FindFromIndexedDB = async (fileName: any) => {
        try {
            getAudioPredictionFile(fileName).then(async () => {
                const audioUrl: any = await loadFromIndexedDB(fileName);
                const audio = new Audio(audioUrl);
                console.log("playAudioFromIndexedDB :", audioUrl);

                setAudioFileUrl(audioUrl);
            })
        } catch (error) {
            console.error(error);
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
                        <div className="flex justify-end space-x-4 mt-12">
                            <button
                                onClick={() => FindFromIndexedDB(selectedRowData.filename)}
                                className="px-4 py-2 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
                            >
                                Yes
                            </button>
                            <button
                                onClick={() => setModalOpen(false)}
                                className="px-4 py-2 bg-gray-600 text-white font-semibold rounded-lg hover:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-gray-500"
                            >
                                No
                            </button>
                            <button onClick={() => setModalDeleteRecheckOpen(true)} className="px-4 py-2 bg-red-500 text-white font-semibold rounded-lg hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-gray-500"><Trash2 /></button>
                        </div>
                    </Box>
                </Modal>
                <Modal
                    open={modalDeleteRecheckOpen}
                    onClose={() => setModalDeleteRecheckOpen(false)}
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
                            Do you want to delete this file? {selectedRowData.filename ? selectedRowData.filename : ""}
                        </Typography>
                        <div className="flex justify-end space-x-4 mt-12">
                            <button
                                onClick={() => deleteAudioFile(selectedRowData.filename)}
                                className="px-4 py-2 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
                            >
                                Yes
                            </button>
                            <button
                                onClick={() => setModalDeleteRecheckOpen(false)}
                                className="px-4 py-2 bg-gray-600 text-white font-semibold rounded-lg hover:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-gray-500"
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
                        {/* <div
                            className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4 mb-8"
                        >
                        </div> */}

                        <div className="grid grid-cols-1 gap-8">
                            <AudioGraph file={audioFileUrl} data={selectedRowData} />
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