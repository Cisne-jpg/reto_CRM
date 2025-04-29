'use client';

import { useState, useEffect, useCallback } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { PieChartTareas, PieDataItem, buildPieData } from "../Components/piechartUtils";

export default function PieChartCard() {
  const [pieData, setPieData] = useState<PieDataItem[]>([]);
  const [ownerId, setOwnerId] = useState<number | null>(null);
  const [loading, setLoading] = useState(true);

  const getApiBaseUrl = useCallback(() => {
    const isLocal = typeof window !== 'undefined' && 
                   (window.location.hostname === 'localhost' || 
                    window.location.hostname === '127.0.0.1');
    return isLocal 
      ? 'http://localhost:3001' 
      : process.env.NEXT_PUBLIC_API_URL || 'https://api-crm-livid.vercel.app';
  }, []);

  const API_BASE_URL = getApiBaseUrl();

  useEffect(() => {
    const storedId = localStorage.getItem("ownerId");
    if (storedId) setOwnerId(Number(storedId));
  }, []);

  const fetchPieData = useCallback(async () => {
    if (!ownerId) return;
    try {
      setLoading(true);
      const data = await buildPieData(
        ["Revision", "En contacto", "Toques finales", "Esperando Confirmación"],
        `${API_BASE_URL}/kanban/${ownerId}`
      );
      setPieData(data);
    } catch (err) {
      console.error("Error fetching pie data:", err);
    } finally {
      setLoading(false);
    }
  }, [ownerId, API_BASE_URL]); // Dependencias

  useEffect(() => {
    fetchPieData();
  }, [fetchPieData]); // Dependencia estable

  return (
    <Card className="flex-1">
      <CardContent>
        <h2 className="font-semibold mb-4">Estado de Negociaciones</h2>
        {loading ? (
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-blue-600"></div>
          </div>
        ) : pieData.length > 0 ? (
          <div className="min-h-[300px] h-full">
            <PieChartTareas pieData={pieData} />
          </div>
        ) : (
          <p className="text-gray-500 text-center py-8">No hay datos disponibles</p>
        )}
      </CardContent>
    </Card>
  );
}