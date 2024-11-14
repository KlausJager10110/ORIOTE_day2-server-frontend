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
    Area,
    ComposedChart,
    LineChart,
} from 'recharts';

type DataType = {
    time: number;
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

const OverAllChart = ({ chartData, title = "title", slice = false, Increase, Decrease, endPoint, startPoint }: Props) => {
    const maxDataLength = chartData.length;

    const getAxisYDomain = (
        from: number,
        to: number,
        ref: keyof DataType,
        offset: number
    ): [number, number] => {
        const refData = chartData.slice(from - 1, to);
        let [bottom, top] = [refData[0][ref], refData[0][ref]];
        refData.forEach((d) => {
            if (d[ref] > top) top = d[ref];
            if (d[ref] < bottom) bottom = d[ref];
        });
        return [(bottom | 0) - offset, (top | 0) + offset];
    }


    // const [data, setData] = useState<DataType[]>(initialData);
    const [left, setLeft] = useState<any>('dataMin');
    const [right, setRight] = useState<any>('dataMax');
    const [refAreaLeft, setRefAreaLeft] = useState<any>('');
    const [refAreaRight, setRefAreaRight] = useState<any>('');
    const [top, setTop] = useState<any>('dataMax+1');
    const [bottom, setBottom] = useState<any>('dataMin');
    const [top2, setTop2] = useState<any>('dataMax+100');
    const [bottom2, setBottom2] = useState<any>('dataMin');
    const [top3, setTop3] = useState<any>('dataMax+100');
    const [bottom3, setBottom3] = useState<any>('dataMin');
    const [top4, setTop4] = useState<any>('dataMax+100');
    const [bottom4, setBottom4] = useState<any>('dataMin');



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
                        onMouseDown={(e) => setRefAreaLeft(e?.activeLabel)}
                        onMouseMove={(e) => refAreaLeft && setRefAreaRight(e?.activeLabel)}
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
                        {graphSelected.energyConsumption && <Line yAxisId="1" type="monotone" name="Energy Consumption" dataKey="energyConsumption" stroke="#8884d8" animationDuration={300} />}
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
