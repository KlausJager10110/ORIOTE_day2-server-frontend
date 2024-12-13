'use client'

import OverAllChart from '@/components/page-components/overAllChart'
import React, { useEffect, useState } from 'react'
import Header from '@/components/common/header'
import { ChevronLast, ChevronLeft, ChevronRight } from 'lucide-react'
import axios from 'axios';
import { DataGrid, GridColDef } from '@mui/x-data-grid';
import Paper from '@mui/material/Paper';
import { Box, Modal, Typography } from '@mui/material'
import { HEADER } from '@/constants/constant'



const columns: GridColDef[] = [
    { field: 'id', headerName: 'ID', flex: 1 },
    { field: 'time', headerName: 'Timestamp', flex: 1 },
    { field: 'force', headerName: 'Force', flex: 1 },
    {
        field: 'pressure',
        headerName: 'Pressure',
        type: 'number',
        flex: 1
    },
    {
        field: 'energyConsumption',
        headerName: 'Energy Consumption',
        type: 'number',
        flex: 1
    },
    {
        field: 'positionOfThePunch',
        headerName: 'Position of the Punch',
        type: 'number',
        flex: 1
    },
];

const paginationModel = { page: 0, pageSize: 5 };

function HistoryPage() {
    const [error, setError] = useState<any>()
    const [lifeCycle, setLifeCycle] = useState(0)
    const [overAllDataArray, setOverAllDataArray] = useState<any[]>([])

    const [startDate, setStartDate] = useState<string>("");
    const [startTime, setStartTime] = useState<string>("");
    const [endDate, setEndDate] = useState<string>("");
    const [endTime, setEndTime] = useState<string>("");

    const [modalOpen, setModalOpen] = useState(false)
    const [getDataRangeSuccess, setGetDataRangeSuccess] = useState("")
    const [getDataRangeError, setGetDataRangeError] = useState("")

    const handleStartDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const selectedStartDate = new Date(e.target.value);
        setStartDate(e.target.value);

        if (endDate && new Date(endDate) < selectedStartDate) {
            const nextDay = new Date(selectedStartDate);
            nextDay.setDate(nextDay.getDate() + 1);
            setEndDate(nextDay.toISOString().split("T")[0]);
        }
    };

    const handleEndDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const selectedEndDate = new Date(e.target.value);
        const startDateObj = new Date(startDate);

        if (startDate && selectedEndDate < startDateObj) {
            alert("End date must be at least 1 day after the start date.");
        } else {
            setEndDate(e.target.value);
        }
    };

    const handleStartTimeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setStartTime(e.target.value);
    };

    const handleEndTimeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setEndTime(e.target.value);
    };


    const getFormattedDateTime = (date: string, time: string) => {
        const dateTimeString = `${date}T${time}:00.000Z`;
        return dateTimeString;
    };

    const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        const startDateTime = getFormattedDateTime(startDate, startTime)
        const endDateTime = getFormattedDateTime(endDate, endTime);
        console.log(startDateTime, endDateTime);

        postHistoryDataFromREST_API(startDateTime, endDateTime)
    }


    function formatISOToCustomDate(isoDate: string) {
        const date = new Date(isoDate);
        const day = String(date.getUTCDate()).padStart(2, '0');
        const month = String(date.getUTCMonth() + 1).padStart(2, '0');
        const year = date.getUTCFullYear();
        const hours = String(date.getUTCHours()).padStart(2, '0');
        const minutes = String(date.getUTCMinutes()).padStart(2, '0');
        return `${day}/${month}/${year} ${hours}:${minutes}`;
    }

    const postHistoryDataFromREST_API = async (start_DT?: string, end_DT?: string) => {
        console.log(start_DT, end_DT);
        try {
            const res = await axios.post('https://3e2c-49-237-36-69.ngrok-free.app/punch-machine/history',
                {
                    start: start_DT,
                    end: end_DT
                },
                {
                    headers: HEADER.headers
                }
            )
            if (res.status === 200) {
                console.log(res.data);
                if (res.data) {
                    setOverAllDataArray((prevData) => {
                        const updatedData = [
                            ...prevData,
                            ...res.data.map((item: any, index: number) => ({
                                id: index + 1,
                                energyConsumptionPower: item.energyConsumption?.power,
                                energyConsumption: item.energyConsumption?.power * 1000 * (0.2 * (index + 1)) / 3600,
                                time: formatISOToCustomDate(item.timestamp),
                                pressure: item.pressure,
                                force: item.force,
                                positionOfThePunch: item.positionOfThePunch,
                                cycle: item.cycleCount,
                            }))
                        ];
                        return updatedData;
                    });
                    setGetDataRangeSuccess("")
                    setGetDataRangeError("")
                } else if (!res.data) {
                    setGetDataRangeError("Not found Data or invalid Date time Range. Please try again.")
                    setModalOpen(true);
                }
            }
        } catch (error) {
            setError(error)
            setGetDataRangeSuccess("")
            setGetDataRangeError("error: " + error)
            setModalOpen(true);
        }
    }

    const maxDataLength = overAllDataArray.length;
    const pageSize = 200; // จำนวนข้อมูลที่ต้องการแสดงต่อหน้า
    const [currentPage, setCurrentPage] = useState(0);

    // คำนวณค่า startPoint และ endPoint จาก currentPage และ pageSize
    const startPoint = currentPage * pageSize;
    const endPoint = Math.min(startPoint + pageSize, maxDataLength);

    const handleNext = () => {
        if (startPoint + pageSize < maxDataLength) {
            setCurrentPage((prevPage) => prevPage + 1);
        }
    };

    const handlePrevious = () => {
        if (currentPage > 0) {
            setCurrentPage((prevPage) => prevPage - 1);
        }
    };



    return (
        <div className="flex-1 overflow-auto relative z-10">
            <Header title="HISTORY PAGE" />
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
                            {getDataRangeSuccess ? getDataRangeSuccess : getDataRangeError ? getDataRangeError : ""}
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
                            className="grid grid-cols-1 gap-5 mb-8"
                        >
                            <form onSubmit={handleSubmit} className='flex flex-col gap-3 items-center'>
                                <div className="flex flex-row gap-2 justify-center items-center lg:col-span-2">
                                    <div className="flex flex-row justify-center items-center gap-2">
                                        <label htmlFor="start" className='font-bold'>Start Date : </label>
                                        <input
                                            className='py-2 px-4 rounded-md text-black'
                                            type="date"
                                            id="start"
                                            name='start'
                                            value={startDate}
                                            onChange={handleStartDateChange}
                                        />
                                    </div>
                                    <div className='flex flex-col justify-center items-center'>-</div>
                                    <div className="flex flex-row justify-center items-center gap-2">
                                        <label htmlFor="end" className='font-bold'>End Date: </label>
                                        <input
                                            className='py-2 px-4 rounded-md text-black'
                                            type="date"
                                            id="end"
                                            name='end'
                                            value={endDate}
                                            onChange={handleEndDateChange}
                                        />
                                    </div>
                                </div>
                                <div className="flex flex-row gap-2 justify-center items-center lg:col-span-2">
                                    <div className="flex flex-row justify-center items-center gap-2">
                                        <label htmlFor="startTime" className='font-bold'>Start Time : </label>
                                        <input
                                            className='py-2 px-4 rounded-md text-black'
                                            type="time"
                                            id="startTime"
                                            name='startTime'
                                            value={startTime}
                                            onChange={handleStartTimeChange}
                                        />
                                    </div>
                                    <div className='flex flex-col justify-center items-center'>-</div>
                                    <div className="flex flex-row justify-center items-center gap-2">
                                        <label htmlFor="endTime" className='font-bold'>End Time: </label>
                                        <input
                                            className='py-2 px-4 rounded-md text-black'
                                            type="time"
                                            id="endTime"
                                            name='endTime'
                                            value={endTime}
                                            onChange={handleEndTimeChange}
                                        />
                                    </div>
                                </div>
                                <button type="submit" className="flex flex-row justify-center items-center gap-2 w-[100px] h-[50px] bg-gray-500 bg-opacity-50 backdrop-blur-md overflow-hidden shadow-lg rounded-md border border-gray-700">OK</button>
                            </form>
                        </div>

                        {/* Charts */}
                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                            <div className="lg:col-span-2">
                                {true ? ( //overAllDataArray.length > 0
                                    <>
                                        <div className="flex justify-end mt-4 mb-2">
                                            <button
                                                onClick={handlePrevious}
                                                disabled={currentPage === 0}
                                                className="px-2 py-2 mx-2 bg-gray-500 rounded-md disabled:opacity-50"
                                            >
                                                <ChevronLeft />
                                            </button>

                                            <button
                                                onClick={handleNext}
                                                disabled={endPoint >= maxDataLength}
                                                className="px-2 py-2 mx-2 bg-gray-500 rounded-md disabled:opacity-50"
                                            >
                                                <ChevronRight />
                                            </button>
                                        </div>
                                        <OverAllChart chartData={overAllDataArray.slice(startPoint, endPoint)} title="History Overview" />
                                    </>
                                ) : (
                                    <div className="lg:col-span-2 bg-gray-800 bg-opacity-50 backdrop-blur-md shadow-lg rounded-xl p-4 border border-gray-700"><ChevronLast className=' inline-block' /> No data found. Please choose a date and time.</div>
                                )}
                            </div>
                            <div className="lg:col-span-2 bg-gray-800 bg-opacity-50 backdrop-blur-md shadow-lg rounded-xl p-4 border border-gray-700">
                                <h2 className="text-lg font-extrabold mb-4 text-gray-100">History Table</h2>
                                <DataTable rows={overAllDataArray} columns={columns} paginationModel={paginationModel} />
                            </div>
                        </div>
                    </>
                }
            </main>
        </div>
    )
}

export default HistoryPage



export function DataTable({ rows, columns, paginationModel, onSelectionModelChange }: { rows: any, columns: any, paginationModel: any, onSelectionModelChange?: (selection: any) => void }) {
    return (
        <Paper sx={{ height: 400, width: '100%' }} className="p-2">
            <DataGrid
                rows={rows}
                columns={columns}
                initialState={{ pagination: { paginationModel } }}
                pageSizeOptions={[5, 10]}
                onRowSelectionModelChange={onSelectionModelChange}
                sx={{ border: 0 }}
            />
        </Paper>
    );
}