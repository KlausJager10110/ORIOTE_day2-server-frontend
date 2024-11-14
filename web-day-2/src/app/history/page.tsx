'use client'

import StatCard from '@/components/common/statCard'
import OverAllChart from '@/components/page-components/overAllChart'
import React, { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import Header from '@/components/common/header'
import { ChevronLast, Recycle } from 'lucide-react'
import axios from 'axios';
import { DataGrid, GridColDef } from '@mui/x-data-grid';
import Paper from '@mui/material/Paper';



const columns: GridColDef[] = [
    { field: 'id', headerName: 'ID', width: 70 },
    { field: 'time', headerName: 'Timestamp', width: 130 },
    { field: 'force', headerName: 'Force', width: 130 },
    {
        field: 'pressure',
        headerName: 'Pressure',
        type: 'number',
        width: 100,
    },
    {
        field: 'energyConsumption',
        headerName: 'Energy Consumption',
        type: 'number',
        width: 200,
    },
    {
        field: 'positionOfThePunch',
        headerName: 'Position of the Punch',
        type: 'number',
        width: 200,
    },
];

const paginationModel = { page: 0, pageSize: 5 };

function HistoryPage() {
    const [error, setError] = useState<any>()
    const [lifeCycle, setLifeCycle] = useState(0)
    const [overAllDataArray, setOverAllDataArray] = useState<any[]>([])


    // const currentDate = new Date();
    // const currentDateBangkok = new Date(currentDate.toLocaleString("en-US", { timeZone: "Asia/Bangkok" }));
    // const startDateTime = new Date(currentDateBangkok.getTime() - (60 * 60 * 1000)).toISOString();
    // const endDateTime = currentDateBangkok.toISOString();


    const [startDate, setStartDate] = useState<string>("");
    const [startTime, setStartTime] = useState<string>("");
    const [endDate, setEndDate] = useState<string>("");
    const [endTime, setEndTime] = useState<string>("");

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

        // const startDateTime = getFormattedDateTime(startDate, startTime);
        // const endDateTime = getFormattedDateTime(endDate, endTime);

        const startDateTime = getFormattedDateTime(startDate, startTime)
        const endDateTime = getFormattedDateTime(endDate, endTime);
        console.log(startDateTime, endDateTime);
        // console.log(startDate, endDate, startTime, endTime);

        postHistoryDataFromREST_API(startDateTime, endDateTime)
    }


    const postHistoryDataFromREST_API = async (start_DT?: string, end_DT?: string) => {
        console.log(start_DT, end_DT);
        try {
            const res = await axios.post('https://3e2c-49-237-36-69.ngrok-free.app/punch-machine/history',
                {
                    start: start_DT,
                    end: end_DT
                }
            )
            if (res.status === 200) {
                console.log(res.data);
                if (res.data) {
                    setOverAllDataArray((prevData) => {
                        const updatedData = [
                            ...prevData,
                            ...res.data.map((item: any, index: number) => ({
                                id: item._id,
                                energyConsumptionPower: item.energyConsumption?.power,
                                energyConsumption: item.energyConsumption?.power * 1000 * (0.2 * (index + 1)) / 3600,
                                time: item.timestamp,
                                pressure: item.pressure,
                                force: item.force,
                                positionOfThePunch: item.positionOfThePunch,
                                cycle: item.cycleCount,
                            }))
                        ];
                        return updatedData;
                    });
                }
            }
        } catch (error) {
            setError(error)
        }
    }
    return (
        <div className="flex-1 overflow-auto relative z-10">
            <Header title="HISTORY PAGE" />
            <main className=" max-w-7xl mx-auto py-6 px-4 lg:px-8">
                {!true ?
                    <div className="p-4 rounded-md bg-slate-700 text-red-500">
                        <h1>Error connecting. Please try again.</h1>
                    </div>
                    :
                    <>
                        <motion.div
                            className="grid grid-cols-1 gap-5 mb-8"
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 1 }}
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
                        </motion.div>

                        {/* Charts */}
                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                            <div className="lg:col-span-2">
                                {true ? ( //overAllDataArray.length > 0
                                    <>
                                        <OverAllChart chartData={overAllDataArray.slice(0, 200)} title="History Overview" slice={true} />
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



export function DataTable({ rows, columns, paginationModel }: any) {
    return (
        <Paper sx={{ height: 400, width: '100%' }} className="p-2 ">
            <DataGrid
                rows={rows}
                columns={columns}
                initialState={{ pagination: { paginationModel } }}
                pageSizeOptions={[5, 10]}
                // checkboxSelection
                sx={{ border: 0 }}
            />
        </Paper>
    );
}