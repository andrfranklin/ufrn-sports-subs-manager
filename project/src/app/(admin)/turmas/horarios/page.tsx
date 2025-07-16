"use client";

import { useEffect, useState } from "react";
import ComponentCard from '@/components/common/ComponentCard';
import Calendar from "@/components/calendar/Calendar";

export default function HorariosPage() {
  const [events, setEvents] = useState([]);

  useEffect(() => {
    fetch("/api/classes")
      .then(res => res.json())
      .then(data => {
        const daysMap = {
          sunday: 0, monday: 1, tuesday: 2, wednesday: 3,
          thursday: 4, friday: 5, saturday: 6
        };
        const calendarEvents = data.map((turma: any) => ({
          title: turma.name,
          daysOfWeek: turma.daysOfWeek.map((d: string) => daysMap[d as keyof typeof daysMap]),
          startTime: turma.startTime.slice(11, 16),
          endTime: turma.endTime.slice(11, 16),
        }));
        setEvents(calendarEvents);
      });
  }, []);

  return (
    <ComponentCard title="Horários das Turmas">
      <Calendar events={events} />
    </ComponentCard>
  );
} 