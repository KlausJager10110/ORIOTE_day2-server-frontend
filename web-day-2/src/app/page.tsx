'use client'

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import StatCard from "@/components/common/statCard";
import { MonitorCog, Pause, Play, Recycle } from "lucide-react";
import Header from "@/components/common/header";
import EnergyConsumption from "@/components/page-components/energyConsumptionChart";
import VoltageUsageChart from "@/components/page-components/voltageUsageChart";
import ForceChart from "@/components/page-components/forceChart";
import PositionPunchChart from "@/components/page-components/positionPunchChart";
import PressureChart from "@/components/page-components/pressureChart";
import OverAllChart from "@/components/page-components/overAllChart";


export default function Home() {
  const delay = 0;
  const [energyConsumptionDataArray, setEnergyConsumptionDataArray] = useState<any[]>([]);
  const [voltageUsageChartDataArray, setVoltageUsageChartDataArray] = useState<any[]>([]);
  const [pressureChartDataArray, setPressureChartDataArray] = useState<any[]>([]);
  const [forceChartDataArray, setForceChartDataArray] = useState<any[]>([]);
  const [positionOfThePunchChartDataArray, setPositionOfThePunchChartDataArray] = useState<any[]>([]);
  const [overAllDataArray, setOverAllDataArray] = useState<any[]>([]);
  const [lifeCycle, setLifeCycle] = useState<number>(0);
  const [allState, setAllState] = useState(true);
  const [socketData, setSocketData] = useState<any>(null);
  let timeInterval = 0.2;

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
    let ws: WebSocket | null = null;

    if (allState) {
      ws = new WebSocket("ws://technest.ddns.net:8001/ws");
      const api_key = "f1b17e2b414bc422a4b8e78ad6fb65bc";

      ws.onopen = () => {
        ws?.send(api_key);
        console.log("WebSocket Connected");
      };

      ws.onerror = (event) => {
        console.log("Error connecting to WebSocket:", event);
      };

      ws.onmessage = (event) => {
        try {
          const data = JSON.parse(event.data);
          const timestamp = new Date().toLocaleString("en-GB", { timeZone: "Asia/Bangkok" });
          if (data["Cycle Count"] === 0) {
            timeInterval = 0.2;
          }
          timeInterval += 0.2;
          data["time"] = timestamp;
          data["_energyConsumption"] = data["Energy Consumption"]?.Power * timeInterval;
          setLifeCycle(data["Cycle Count"]);
          setSocketData(data);
        } catch {
          const data = parseMessageToJson(event.data);
          const timestamp = new Date().toLocaleString("en-GB", { timeZone: "Asia/Bangkok" });
          if (data["Cycle Count"] === 0) {
            timeInterval = 0.2;
          }
          timeInterval += 0.2;
          data["time"] = timestamp;
          data["_energyConsumption"] = data["Energy Consumption"]?.Power * timeInterval;
          setLifeCycle(data["Cycle Count"]);
          setSocketData(data);
        }
      };

      ws.onclose = (event) => {
        console.log("WebSocket Disconnected", event);
      };
    }

    return () => {
      if (ws) {
        ws.close();
        console.log("WebSocket Disconnected");
      }
    };
  }, [allState]);

  useEffect(() => {
    if (!socketData) return;

    const interval = setInterval(() => {
      if (overAllDataArray.length < 200) {
        setOverAllDataArray((prevData) => [
          ...prevData,
          {
            time: socketData["time"],
            energyConsumption: socketData._energyConsumption,
            pressure: socketData.Pressure,
            force: socketData.Force,
            positionOfThePunch: socketData["Position of the Punch"],
            energyConsumptionPower: socketData["Energy Consumption"]?.["Power"],
            cycle: socketData["Cycle Count"]
          }
        ]);
      } else {
        setOverAllDataArray([]);
        timeInterval = 0.2;
      }

      setEnergyConsumptionDataArray((prevData) => {
        const updatedData = [...prevData, { time: socketData["time"], power: socketData["Energy Consumption"]?.["Power"], cycle: socketData["Cycle Count"] }];
        if (updatedData.length > 20) updatedData.shift();
        return updatedData;
      });

      setVoltageUsageChartDataArray((prevData) => {
        const updatedData = [...prevData, { time: socketData["time"], L1_GND: socketData.Voltage?.["L1-GND"], L2_GND: socketData.Voltage?.["L2-GND"], L3_GND: socketData.Voltage?.["L3-GND"], cycle: socketData["Cycle Count"] }];
        if (updatedData.length > 20) updatedData.shift();
        return updatedData;
      });

      setPressureChartDataArray((prevData) => {
        const updatedData = [...prevData, { time: socketData["time"], pressure: socketData.Pressure, cycle: socketData["Cycle Count"] }];
        if (updatedData.length > 20) updatedData.shift();
        return updatedData;
      });

      setForceChartDataArray((prevData) => {
        const updatedData = [...prevData, { time: socketData["time"], force: socketData.Force, cycle: socketData["Cycle Count"] }];
        if (updatedData.length > 20) updatedData.shift();
        return updatedData;
      });

      setPositionOfThePunchChartDataArray((prevData) => {
        const updatedData = [...prevData, { time: socketData["time"], position: socketData["Position of the Punch"], cycle: socketData["Cycle Count"] }];
        if (updatedData.length > 20) updatedData.shift();
        return updatedData;
      });

      setSocketData(null);
    }, delay);

    return () => clearInterval(interval);
  }, [socketData, delay]);

  return (
    <div className="flex-1 overflow-auto relative z-10">
      <Header title="OVERVIEW PAGE" />
      <main className=" max-w-7xl mx-auto py-6 px-4 lg:px-8">
        {!true ?
          <div className="p-4 rounded-md bg-slate-700 text-red-500">
            <h1>Error connecting. Please try again.</h1>
          </div>
          :
          <>
            <div
              className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4 mb-8"
            >
              <StatCard name="Machine ID" icon={MonitorCog} value={"PHYS.IOTE01"} color="#F59E0B" />
              <StatCard name="Machine Cycle" icon={Recycle} value={lifeCycle} color="#6366F1" />
              <button onClick={() => setAllState(!allState)} className={`flex flex-row justify-center items-center gap-2 w-[100px] h-[50px] ${allState ? "bg-red-500" : "bg-green-500"} bg-opacity-50 backdrop-blur-md overflow-hidden shadow-lg rounded-xl border border-gray-700`}>{allState ? <span>Pause</span> : <span>Start</span>} {allState ? <Pause /> : <Play />}</button>
            </div>

            {/* Charts */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              <div className="lg:col-span-2">
                <OverAllChart chartData={overAllDataArray} title="Overall" />
              </div>
              <EnergyConsumption chartData={energyConsumptionDataArray} />
              <VoltageUsageChart chartData={voltageUsageChartDataArray} />
              <PressureChart chartData={pressureChartDataArray} />
              <ForceChart chartData={forceChartDataArray} />
              <PositionPunchChart chartData={positionOfThePunchChartDataArray} />
            </div>
          </>
        }
      </main>
    </div>
  );
}
