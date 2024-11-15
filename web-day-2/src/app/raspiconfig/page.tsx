'use client'

import Header from '@/components/common/header'
import { HEADER } from '@/constants/constant'
import { Box, Modal, Typography } from '@mui/material'
import axios from 'axios'
import React, { useEffect, useState } from 'react'

type Props = {}

function RaspiConfigPage({ }: Props) {
    const [postSuccess, setPostSuccess] = useState("")
    const [postError, setPostError] = useState("")
    const [getModelError, setGetModelError] = useState("")
    const [getModelSuccess, setGetModelSuccess] = useState("")
    const [modalOpen, setModalOpen] = useState(false)

    const postTrainModel = async () => {
        try {
            const res = await axios.post('https://3e2c-49-237-36-69.ngrok-free.app/update-model', {}, { headers: HEADER.headers })
            if (res.status === 200) {
                setPostSuccess("Successfully updated")
                setPostError("")
                setModalOpen(true)
            }
        } catch (error) {
            console.log(error);
            setPostError(`Error: ${error}`)
            setPostSuccess("")
            setModalOpen(true)
        }
    }

    const getLastestModelData = async () => {
        try {
            const res = await axios.get('https://3e2c-49-237-36-69.ngrok-free.app/', { headers: HEADER.headers })
            if (res.status === 200) {
                setGetModelError("")
            }
        } catch (error) {
            console.log(error)
            setGetModelError("error")
        }
    }

    useEffect(() => {
        getLastestModelData();
    }, [])



    return (
        <div className="flex-1 overflow-auto relative z-10">
            <Header title="RASBERY PI" />
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
                            {postSuccess ? postSuccess : postError ? postError : ""}
                        </Typography>
                        <div className="flex justify-end space-x-4 mt-12">
                            <button
                                onClick={() => setModalOpen(false)}
                                className="px-4 py-2 bg-gray-600 text-white font-semibold rounded-lg hover:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-gray-500"
                            >
                                OK
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
                            className="flex flex-row items-center justify-between gap-5 mb-8 px-8 p-4 shadow-md rounded-md border-gray-100 bg-gray-600"
                        >
                            <span className=' font-extrabold text-2xl'>Update Model</span>
                            <button onClick={() => postTrainModel()} className={`flex flex-row justify-center items-center hover:bg-gray-200 hover:text-gray-800 gap-2 w-[100px] bg-gray-700  h-[50px] bg-opacity-50 backdrop-blur-md overflow-hidden shadow-lg rounded-xl border border-gray-300`}>send</button>
                        </div>
                    </>
                }
            </main>
        </div>
    )
}

export default RaspiConfigPage