'use client'

import Image from "next/image";
import { motion } from "framer-motion";
import StatCard from "@/components/common/statCard";
import { MonitorCog, Recycle } from "lucide-react";
import Header from "@/components/common/header";
import EnergyConsumption from "@/components/page-components/energyConsumptionChart";
import { useEffect, useState } from "react";
import VoltageUsageChart from "@/components/page-components/voltageUsageChart";
import ForceChart from "@/components/page-components/forceChart";
import PositionPunchChart from "@/components/page-components/positionPunchChart";
import PressureChart from "@/components/page-components/pressureChart";


export default function Home() {
  const delay = 0;
  const api_key = "1990947672a3dab4da6d5f3e5f15b1ef";
  const [energyConsumptionDataArray, setEnergyConsumptionDataArray] = useState<any[]>([]);
  const [voltageUsageChartDataArray, setVoltageUsageChartDataArray] = useState<any[]>([]);
  const [pressureChartDataArray, setPressureChartDataArray] = useState<any[]>([]);
  const [forceChartDataArray, setForceChartDataArray] = useState<any[]>([])
  const [positionOfThePunchChartDataArray, setPositionOfThePunchChartDataArray] = useState<any[]>([])
  const [lifeCycle, setLifeCycle] = useState<number>(0)
  let socketData: any = null

  const parseMessageToJson = (message: string): Record<string, any> => {
    const result: Record<string, any> = {};
    const parts = message.split("&");

    parts.forEach(part => {
      const [topic, keyValue] = part.split("=");
      if (topic && keyValue) {
        const [key, value] = keyValue.split(":");
        if (key && value) {
          if (!result[topic]) {
            result[topic] = {};
          }
          result[topic][key.trim()] = value.trim();
        }
      }
    });

    return result;
  };

  useEffect(() => {
    const ws = new WebSocket("ws://technest.ddns.net:8001/ws");
    ws.onopen = (event) => {
      ws.send(api_key);
    };

    ws.onmessage = (event) => {
      try {
        const data: Record<string, any> = JSON.parse(event.data);
        const timestamp = new Date().toLocaleString("en-GB", { timeZone: "Asia/Bangkok" });
        data['time'] = timestamp;
        setLifeCycle(data['Cycle Count'])
        socketData = data;
      } catch {
        const data = parseMessageToJson(event.data);
        const timestamp = new Date().toLocaleString("en-GB", { timeZone: "Asia/Bangkok" });
        data['time'] = timestamp;
        setLifeCycle(data['Cycle Count'])
        socketData = data;
      }
    };

    setInterval(() => {
      if (socketData === null) {
        return;
      }

      let data = socketData;

      setEnergyConsumptionDataArray((prevData) => {
        const updatedData = [...prevData, { time: data['time'], power: data['Energy Consumption']?.['Power'], cycle: data['Cycle Count'] }];
        if (updatedData.length > 20) {
          updatedData.shift();
        }
        return updatedData;
      });
      setVoltageUsageChartDataArray((prevData) => {
        const updatedData = [...prevData, { time: data['time'], L1_GND: data.Voltage?.["L1-GND"], L2_GND: data.Voltage?.["L2-GND"], L3_GND: data.Voltage?.["L3-GND"], cycle: data['Cycle Count'] }];
        if (updatedData.length > 20) {
          updatedData.shift();
        }
        return updatedData;
      });
      setPressureChartDataArray((prevData) => {
        const updatedData = [...prevData, { time: data['time'], pressure: data.Pressure, cycle: data['Cycle Count'] }];
        if (updatedData.length > 20) {
          updatedData.shift();
        }
        return updatedData;
      })
      setForceChartDataArray((prevData) => {
        const updatedData = [...prevData, { time: data['time'], force: data.Force, cycle: data['Cycle Count'] }];
        if (updatedData.length > 20) {
          updatedData.shift();
        }
        return updatedData;
      })
      setPositionOfThePunchChartDataArray((prevData) => {
        const updatedData = [...prevData, { time: data['time'], position: data['Position of the Punch'], cycle: data['Cycle Count'] }];
        if (updatedData.length > 20) {
          updatedData.shift();
        }
        return updatedData;
      })

      socketData = null;
    }, delay);

    return () => {
      ws.close();
    };
  }, []);



  return (
    <div className="flex-1 overflow-auto relative z-10">
      <Header title="ORIOTE" />
      <main className=" max-w-7xl mx-auto py-6 px-4 lg:px-8">
        <motion.div
          className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4 mb-8"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1 }}
        >
          <StatCard name="Machine ID" icon={MonitorCog} value={"M001EF"} color="#F59E0B" />
          <StatCard name="Machine Cycle" icon={Recycle} value={lifeCycle} color="#6366F1" />
        </motion.div>

        {/* Charts */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <EnergyConsumption chartData={energyConsumptionDataArray} />
          <VoltageUsageChart chartData={voltageUsageChartDataArray} />
          <PressureChart chartData={pressureChartDataArray} />
          <ForceChart chartData={forceChartDataArray} />
          <PositionPunchChart chartData={positionOfThePunchChartDataArray} />
        </div>
      </main>
    </div>
  );
}
