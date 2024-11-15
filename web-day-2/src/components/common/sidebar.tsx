"use client";

import { BarChart2, ChartLine, DollarSign, FileClock, Menu, Settings, ShoppingBag, ShoppingCart, TrendingUp } from 'lucide-react'
import React, { useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion';
import Link from 'next/link';



const SIDEBAR_ITEMS = [
    {
        name: "Overview",
        icon: BarChart2,
        color: "#6366f1",
        href: "/",
    },
    { name: "Rasbery Pi Control", icon: ShoppingBag, color: "#8B5CF6", href: "/raspiconfig" },
    { name: "History", icon: FileClock, color: "#EC4899", href: "/history" },
    { name: "Audio Prediction", icon: ChartLine, color: "#10B981", href: "/audioprediction" },
    // { name: "Orders", icon: ShoppingCart, color: "#F59E0B", href: "/orders" },
    // { name: "Analytics", icon: TrendingUp, color: "#3B82F6", href: "/analytics" },
    // { name: "Settings", icon: Settings, color: "#6EE7B7", href: "/settings" },
]


function Sidebar() {
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);
    return (
        <motion.div
            className={`relative z-10 transition-all duration-300 ease-in-out flex-shrink-0 ${isSidebarOpen ? 'w-64' : 'w-20'}`}
            animate={{ width: isSidebarOpen ? 256 : 80 }}
        >
            <div className=" h-full bg-gray-800 bg-opacity-50 backdrop-blur-sm p-4 flex flex-col border-r border-gray-700">
                <motion.button
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                    onClick={() => setIsSidebarOpen(!isSidebarOpen)}
                    className="p-2 rounded-full hover:bg-gray-700 transition-colors max-w-fit"
                >
                    <Menu size={24} />
                </motion.button>

                <nav className="mt-8 flex-grow">
                    {SIDEBAR_ITEMS.map((item, idx) => (
                        <Link key={item.href} href={item.href}>
                            <motion.div className="flex items-center p-4 text-sm font-medium rounded-lg hover:bg-gray-700 transition-colors mb-2">
                                <item.icon size={20} style={{ color: item.color, minWidth: "20px" }} />

                                <AnimatePresence>
                                    {isSidebarOpen && (
                                        <motion.span
                                            className="ml-4 whitespace-nowrap"
                                            initial={{ opacity: 0, width: 0 }}
                                            animate={{ opacity: 1, width: "auto" }}
                                            exit={{ opacity: 0, width: 0 }}
                                            transition={{ duration: 0.2, delay: 0.3 }}
                                        >
                                            {item.name}
                                        </motion.span>
                                    )}
                                </AnimatePresence>
                            </motion.div>
                        </Link>
                    ))}
                </nav>
            </div>
        </motion.div>
    )
}

export default Sidebar