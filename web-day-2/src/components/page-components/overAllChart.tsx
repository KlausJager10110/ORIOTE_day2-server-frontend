import { ChevronLeft, ChevronRight, ZoomOut } from 'lucide-react';
import React, { useState } from 'react';
import {
    Line,
    CartesianGrid,
    XAxis,
    YAxis,
    Tooltip,
    ReferenceArea,
    ResponsiveContainer,
    Legend,
    LineChart,
} from 'recharts';

type DataType = {
    time: any;
    energyConsumption: number;
    pressure: number;
    force: number;
    positionOfThePunch: number;
    energyConsumptionPower: number;
    cycle: number;
};

type Props = {
    chartData: DataType[];
    title?: string;
    slice?: boolean;
    Increase?: () => void;
    Decrease?: () => void;
    endPoint?: any;
    startPoint?: number;
};

const refChartData = [
    {
        cycle: 8936,
        energyConsumption: 62.45631734322057,
        energyConsumptionPower: 104.09386223870094,
        force: 0.122459197300464,
        positionOfThePunch: 144.4679421260184,
        pressure: -0.47394092781622754,
        time: "15/11/2024, 06:33:43"
    },
    {
        cycle: 8937,
        energyConsumption: 88.59714508528998,
        energyConsumptionPower: 110.74643135661246,
        force: 30.25125046659326,
        positionOfThePunch: 108.83815913866316,
        pressure: 20.06370544968503,
        time: "15/11/2024, 06:33:43"
    },
    {
        cycle: 8938,
        energyConsumption: 92.6680112059892,
        energyConsumptionPower: 92.6680112059892,
        force: 0.14435273651387134,
        positionOfThePunch: 72.17945313273606,
        pressure: -0.216125676771587,
        time: "15/11/2024, 06:33:43"
    },
    {
        cycle: 8939,
        energyConsumption: 122.14115450613743,
        energyConsumptionPower: 101.7842954217812,
        force: -0.21288906982947947,
        positionOfThePunch: 35.909783438701524,
        pressure: 0.10405262269744946,
        time: "15/11/2024, 06:33:43"
    },
    {
        cycle: 8941,
        energyConsumption: 134.06110248271582,
        energyConsumptionPower: 95.75793034479702,
        force: 30.499367824613596,
        positionOfThePunch: -0.5071506356441793,
        pressure: 20.87257294002275,
        time: "15/11/2024, 06:33:44"
    },
    {
        cycle: 8942,
        energyConsumption: 153.5111346209191,
        energyConsumptionPower: 95.94445913807445,
        force: -0.6634484403169423,
        positionOfThePunch: 34.77816919708457,
        pressure: 0.3221612352415891,
        time: "15/11/2024, 06:33:44"
    },
    {
        cycle: 8943,
        energyConsumption: 183.1649504154355,
        energyConsumptionPower: 101.75830578635306,
        force: 30.53472820781529,
        positionOfThePunch: 72.42302413406964,
        pressure: 20.924172856873742,
        time: "15/11/2024, 06:33:44"
    },
    {
        cycle: 8944,
        energyConsumption: 199.54093748733203,
        energyConsumptionPower: 99.77046874366603,
        force: 0.15709520641857436,
        positionOfThePunch: 108.15297230056132,
        pressure: 0.24598343475596735,
        time: "15/11/2024, 06:33:44"
    },
    {
        cycle: 8945,
        energyConsumption: 226.80845809621368,
        energyConsumptionPower: 103.09475368009714,
        force: 29.663580831260788,
        positionOfThePunch: 144.36076211082712,
        pressure: 20.544947833855222,
        time: "15/11/2024, 06:33:45"
    },
    {
        cycle: 8946,
        energyConsumption: 231.40395829329896,
        energyConsumptionPower: 96.41831595554123,
        force: 0.05088406123517551,
        positionOfThePunch: 180.06862325153742,
        pressure: 0.11831299561600214,
        time: "15/11/2024, 06:33:45"
    },
];



const OverAllChart = ({ chartData, title = "title", slice = false, Increase, Decrease, endPoint, startPoint }: Props) => {
    const maxDataLength = chartData.length;
    console.log(chartData)

    const getAxisYDomain = (
        from: number,
        to: number,
        ref: keyof DataType,
        offset: number
    ): [number, number] => {
        const refData: any[] = refChartData.slice(from - 1, to);

        if (refData.length === 0) {
            return [10, offset];
        }

        let [bottom, top] = [refData[0][ref], refData[0][ref]];
        refData.forEach((d) => {
            if (d[ref] > top) top = d[ref];
            if (d[ref] < bottom) bottom = d[ref];
        });
        return [(bottom | 0) - offset, (top | 0) + offset];
    };

    const [left, setLeft] = useState<string | number>('dataMin');
    const [right, setRight] = useState<any>('dataMax');
    const [refAreaLeft, setRefAreaLeft] = useState<any>('');
    const [refAreaRight, setRefAreaRight] = useState<any>('');
    const [top, setTop] = useState<string | number>('dataMax+1');
    const [bottom, setBottom] = useState<string | number>('dataMin');
    const [top2, setTop2] = useState<string | number>('dataMax+100');
    const [bottom2, setBottom2] = useState<string | number>('dataMin');
    const [top3, setTop3] = useState<string | number>('dataMax+100');
    const [bottom3, setBottom3] = useState<string | number>('dataMin');
    const [top4, setTop4] = useState<string | number>('dataMax+100');
    const [bottom4, setBottom4] = useState<string | number>('dataMin');



    const zoom = () => {
        if (refAreaLeft === refAreaRight || refAreaRight === '') {
            setRefAreaLeft('');
            setRefAreaRight('');
            return;
        }

        let leftVal = refAreaLeft;
        let rightVal = refAreaRight;
        if (leftVal > rightVal) [leftVal, rightVal] = [rightVal, leftVal];

        const [bottom, top] = getAxisYDomain(leftVal, rightVal, 'energyConsumption', 1);
        const [bottom2, top2] = getAxisYDomain(leftVal, rightVal, 'pressure', 50);
        const [bottom3, top3] = getAxisYDomain(leftVal, rightVal, 'positionOfThePunch', 100);
        const [bottom4, top4] = getAxisYDomain(leftVal, rightVal, 'force', 150);

        setLeft(leftVal);
        setRight(rightVal);
        setBottom(bottom);
        setTop(top);
        setBottom2(bottom2);
        setTop2(top2);
        setBottom3(bottom3);
        setTop3(top3);
        setBottom4(bottom4);
        setTop4(top4);
        setRefAreaLeft('');
        setRefAreaRight('');
    };

    const zoomOut = () => {
        setLeft('dataMin');
        setRight('dataMax');
        setTop('dataMax+1');
        setBottom('dataMin');
        setTop2('dataMax+100');
        setBottom2('dataMin');
        setTop3('dataMax+100');
        setBottom3('dataMin');
        setTop4('dataMax+100');
        setBottom4('dataMin');
        setRefAreaLeft('');
        setRefAreaRight('');
    };

    const [graphSelected, setGraphSelected] = useState({
        energyConsumption: true,
        pressure: true,
        positionOfPunch: true,
        force: true,
    })


    return (
        <div
            className="bg-gray-800 bg-opacity-50 backdrop-blur-md shadow-lg rounded-xl p-6 border border-gray-700"
        >
            <div className="flex flex-row justify-between">
                <h2 className="text-lg font-extrabold mb-4 text-gray-100">{title}</h2>
                {slice &&
                    <div className="flex flex-row justify-center items-center gap-2">
                        <button onClick={Decrease} disabled={startPoint === 0}><ChevronLeft className="cursor-pointer" /></button>
                        <div className=" font-bold">{100}</div>
                        <button onClick={Increase} disabled={endPoint >= maxDataLength}><ChevronRight className=" cursor-pointer" /></button>
                    </div>
                }
            </div>
            <div className='flex flex-row flex-wrap justify-center items-center gap-2 p-2 bg-gray-800 bg-opacity-50 backdrop-blur-md overflow-hidden shadow-lg rounded-xl border border-gray-700 my-4'>
                <div className='flex flex-row gap-2 py-2 px-4 bg-gray-800 bg-opacity-50 backdrop-blur-md overflow-hidden shadow-lg rounded-xl border border-gray-700'>
                    <input
                        onChange={() => setGraphSelected({ ...graphSelected, energyConsumption: !graphSelected.energyConsumption })}
                        type="checkbox"
                        id="energyConsumption"
                        name="energyConsumption"
                        checked={graphSelected.energyConsumption}
                    />
                    <label htmlFor='energyConsumption'>Energy Consumption</label>
                </div>
                <div className='flex flex-row gap-2 py-2 px-4 bg-gray-800 bg-opacity-50 backdrop-blur-md overflow-hidden shadow-lg rounded-xl border border-gray-700'>
                    <input
                        onChange={() => setGraphSelected({ ...graphSelected, pressure: !graphSelected.pressure })}
                        type="checkbox"
                        id="pressure"
                        name="pressure"
                        checked={graphSelected.pressure}
                    />
                    <label htmlFor='pressure'>Pressure</label>
                </div>
                <div className='flex flex-row gap-2 py-2 px-4 bg-gray-800 bg-opacity-50 backdrop-blur-md overflow-hidden shadow-lg rounded-xl border border-gray-700'>
                    <input
                        onChange={() => setGraphSelected({ ...graphSelected, force: !graphSelected.force })}
                        type="checkbox"
                        id="force"
                        name="force"
                        checked={graphSelected.force}
                    />
                    <label htmlFor='force'>Punch force</label>
                </div>
                <div className='flex flex-row gap-2 py-2 px-4 bg-gray-800 bg-opacity-50 backdrop-blur-md overflow-hidden shadow-lg rounded-xl border border-gray-700'>
                    <input
                        onChange={() => setGraphSelected({ ...graphSelected, positionOfPunch: !graphSelected.positionOfPunch })}
                        type="checkbox"
                        id="positionOfPunch"
                        name="positionOfPunch"
                        checked={graphSelected.positionOfPunch}
                    />
                    <label htmlFor='positionOfPunch'>Position of punch</label>
                </div>
            </div>
            <div className="h-auto">
                <div className="flex flex-row justify-between items-center gap-4">
                    <button type="button" className="flex flex-row justify-center items-center gap-3 hover:bg-gray-700 py-2 px-4 mt-2 mb-8 bg-gray-500 bg-opacity-50 backdrop-blur-md overflow-hidden shadow-lg rounded-xl border border-gray-400" onClick={zoomOut}>
                        Zoom Out <ZoomOut />
                    </button>
                    <div className="py-2 px-4 mt-2 mb-8 bg-gray-900 bg-opacity-50 backdrop-blur-md overflow-hidden shadow-lg rounded-xl border border-gray-400">
                        Point : {chartData.length}
                    </div>
                </div>

                <ResponsiveContainer width="100%" height={450}>
                    <LineChart
                        data={Object.values(graphSelected).every(value => value === false) ? [] : chartData}
                        onMouseDown={(e) => setRefAreaLeft(e.activeLabel)}
                        onMouseMove={(e) => refAreaLeft && setRefAreaRight(e.activeLabel)}
                        onMouseUp={zoom}
                    >
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis allowDataOverflow dataKey="time" domain={[left, right]} />
                        {graphSelected.energyConsumption &&
                            <YAxis
                                allowDataOverflow
                                domain={[bottom, top]}
                                type="number"
                                yAxisId="1"
                                label={{ value: 'Energy Consumption', angle: -90, position: 'outsideLeft', dx: -15, }}
                                tick={{
                                    fontSize: 12,
                                }}
                                tickFormatter={(value) => value.toFixed(2)}
                            />
                        }
                        {graphSelected.pressure &&
                            <YAxis
                                orientation="right"
                                allowDataOverflow
                                domain={[bottom2, top2]}
                                type="number"
                                yAxisId="2"
                                label={{ value: 'Pressure', angle: 90, position: 'outsideLeft', dx: 15, }}
                                tick={{
                                    fontSize: 12,
                                }}
                                tickFormatter={(value) => value.toFixed(2)}
                            />
                        }
                        {graphSelected.positionOfPunch &&
                            <YAxis
                                orientation="right"
                                allowDataOverflow
                                domain={[bottom3, top3]}
                                type="number"
                                yAxisId="3"
                                label={{ value: 'Position of the punch', angle: 90, position: 'outsideLeft', dx: 15, }}
                                tick={{
                                    fontSize: 12,
                                }}
                                tickFormatter={(value) => value.toFixed(2)}
                            />
                        }
                        <YAxis
                            orientation="right"
                            allowDataOverflow
                            domain={[bottom4, top4]}
                            type="number"
                            yAxisId="4"
                            label={{ value: 'Force', angle: 90, position: 'outsideLeft', dx: 15, }}
                            tick={{
                                fontSize: 12,
                            }}
                            tickFormatter={(value) => value.toFixed(2)}
                        />
                        <Tooltip
                            contentStyle={{
                                backgroundColor: "rgba(31, 41, 55, 0.8)",
                                borderColor: "#4B5563",
                            }}
                            itemStyle={{ color: "#E5E7EB" }}
                        />
                        {graphSelected.energyConsumption && <Line dot={false} yAxisId="1" type="monotone" name="Energy Consumption" dataKey="energyConsumption" stroke="#8884d8" animationDuration={300} />}
                        {graphSelected.pressure && <Line dot={false} yAxisId="2" type="monotone" name="Pressure" dataKey="pressure" stroke="#82ca9d" animationDuration={300} />}
                        {graphSelected.positionOfPunch && <Line dot={false} yAxisId="3" type="monotone" name="Position of the punch" dataKey="positionOfThePunch" stroke="#829d" animationDuration={300} />}
                        {graphSelected.force && <Line dot={false} yAxisId="4" name="Force" type="monotone" dataKey="force" stroke="#2aad" animationDuration={300} />}

                        {refAreaLeft && refAreaRight ? (
                            <ReferenceArea yAxisId={
                                graphSelected.energyConsumption
                                    ? "1"
                                    : graphSelected.pressure
                                        ? "2"
                                        : graphSelected.positionOfPunch
                                            ? "3"
                                            : undefined
                            } x1={refAreaLeft} x2={refAreaRight} strokeOpacity={0.3} />
                        ) : null}
                        <Legend />

                    </LineChart>
                </ResponsiveContainer>

            </div>
        </div>
    );
};

export default OverAllChart;
