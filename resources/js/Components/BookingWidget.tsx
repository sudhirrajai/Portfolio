import React, { useState, useEffect } from 'react';
import { Calendar, Clock, User, Mail, MessageSquare, CheckCircle, RefreshCcw, ChevronLeft, ChevronRight } from 'lucide-react';
import axios from 'axios';
import { toast } from 'sonner';

export const BookingWidget = () => {
    const [currentMonth, setCurrentMonth] = useState(new Date());
    const [selectedDate, setSelectedDate] = useState<Date | null>(null);
    const [slots, setSlots] = useState<{time: string, label: string}[]>([]);
    const [loadingSlots, setLoadingSlots] = useState(false);
    
    const [selectedSlot, setSelectedSlot] = useState<string | null>(null);
    const [showBookingForm, setShowBookingForm] = useState(false);
    
    // Personal fields
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [notes, setNotes] = useState('');
    const [bookingLoading, setBookingLoading] = useState(false);
    const [bookedSession, setBookedSession] = useState<any>(null);

    // Helpers for generating grid
    const daysInMonth = (date: Date) => new Date(date.getFullYear(), date.getMonth() + 1, 0).getDate();
    const firstDayOfMonth = (date: Date) => new Date(date.getFullYear(), date.getMonth(), 1).getDay();

    // Move calendar back / forth
    const prevMonth = () => {
        const prev = new Date(currentMonth.getFullYear(), currentMonth.getMonth() - 1, 1);
        if (prev.getMonth() >= new Date().getMonth() || prev.getFullYear() > new Date().getFullYear()) {
            setCurrentMonth(prev);
        }
    };
    const nextMonth = () => {
        setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1, 1));
    };

    // Fetch slots when date is chosen
    useEffect(() => {
        if (!selectedDate) return;
        
        const fetchSlots = async () => {
            setLoadingSlots(true);
            setSelectedSlot(null);
            setShowBookingForm(false);
            
            const formattedDate = selectedDate.toISOString().split('T')[0];
            try {
                const res = await axios.get(`/contact/available-slots?date=${formattedDate}`);
                setSlots(res.data.slots);
            } catch (error) {
                toast.error('Failed to pull vacant slots. Please try later!');
            } finally {
                setLoadingSlots(false);
            }
        };

        fetchSlots();
    }, [selectedDate]);

    const handleBookingSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!selectedDate || !selectedSlot) return;
        
        setBookingLoading(true);
        const formattedDate = selectedDate.toISOString().split('T')[0];
        const tz = Intl.DateTimeFormat().resolvedOptions().timeZone;

        try {
            const res = await axios.post('/contact/book', {
                name,
                email,
                date: formattedDate,
                time: selectedSlot,
                brief_notes: notes,
                timezone: tz
            });
            
            setBookedSession(res.data.booking);
            toast.success('discovery call officially locked in!');
        } catch (err: any) {
            if (err.response?.data?.error) {
                toast.error(err.response.data.error);
            } else {
                toast.error('Whoops, something failed. Ensure all fields are valid!');
            }
        } finally {
            setBookingLoading(false);
        }
    };

    // Build calendar grid layout
    const renderCalendarGrid = () => {
        const days = [];
        const totalDays = daysInMonth(currentMonth);
        const startOffset = firstDayOfMonth(currentMonth);
        
        // Convert start offset to start with Monday (offset = offset-1 % 7)
        // But standard JS 0 = Sunday. Let's adapt simpler:
        for (let i = 0; i < startOffset; i++) {
            days.push(<div key={`empty-${i}`} className="h-12 w-full opacity-0" />);
        }

        const today = new Date();
        today.setHours(0, 0, 0, 0);

        for (let dayNum = 1; dayNum <= totalDays; dayNum++) {
            const loopDate = new Date(currentMonth.getFullYear(), currentMonth.getMonth(), dayNum);
            const isPast = loopDate < today;
            
            const isSelected = selectedDate && 
                selectedDate.getDate() === dayNum && 
                selectedDate.getMonth() === currentMonth.getMonth() &&
                selectedDate.getFullYear() === currentMonth.getFullYear();

             days.push(
                <button
                    key={`day-${dayNum}`}
                    type="button"
                    disabled={isPast}
                    onClick={() => setSelectedDate(loopDate)}
                    className={`h-12 w-full rounded-none font-bold text-sm flex items-center justify-center transition-all border-2
                        ${isPast 
                            ? 'text-black/20 dark:text-white/10 border-transparent cursor-not-allowed' 
                            : isSelected
                                ? 'bg-[#FA76FF] text-black border-black dark:border-white shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] scale-[1.02] z-10'
                                : 'bg-white dark:bg-zinc-900 text-black dark:text-white border-black/10 dark:border-white/10 hover:border-black dark:hover:border-white hover:bg-[#FA76FF] hover:text-black hover:translate-y-[-1px] hover:shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]'
                        }`}
                >
                    {dayNum}
                </button>
            );
        }
        return days;
    };

    if (bookedSession) {
        return (
            <div className="border-2 border-black dark:border-white p-8 md:p-12 rounded-none text-center flex flex-col items-center justify-center bg-white dark:bg-zinc-950 shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] dark:shadow-[6px_6px_0px_0px_rgba(255,255,255,1)]">
                <div className="w-16 h-16 bg-[#3DDC97] text-black border-2 border-black rounded-none flex items-center justify-center mb-6 shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]">
                    <CheckCircle className="w-8 h-8" />
                </div>
                <h3 className="text-2xl font-bold mb-2">You're Booked!</h3>
                <p className="text-black/60 dark:text-white/60 mb-6 text-sm max-w-md">
                    A discovery call with Sudhir Rajai is locked in. An invite has been dispatched to <strong className="text-black dark:text-white">{bookedSession.email}</strong>.
                </p>
                
                <div className="bg-white dark:bg-zinc-900 border-2 border-black dark:border-white rounded-none p-5 w-full max-w-sm text-left space-y-3 mb-8 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
                    <div className="flex items-center gap-3 text-sm">
                        <Calendar className="w-4 h-4 text-[#ff6bff]" />
                        <span>{new Date(bookedSession.scheduled_at).toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric', year: 'numeric' })}</span>
                    </div>
                    <div className="flex items-center gap-3 text-sm">
                        <Clock className="w-4 h-4 text-[#ff6bff]" />
                        <span>{new Date(bookedSession.scheduled_at).toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' })} ({Intl.DateTimeFormat().resolvedOptions().timeZone})</span>
                    </div>
                    {bookedSession.google_meet_url && (
                        <div className="pt-3 border-t-2 border-dashed border-black dark:border-white/20">
                            <a 
                                href={bookedSession.google_meet_url}
                                target="_blank" 
                                rel="noreferrer"
                                className="w-full py-2.5 text-center font-bold text-xs uppercase bg-black text-white dark:bg-white dark:text-black rounded-none border-2 border-black dark:border-white transition-all flex items-center justify-center gap-2 hover:translate-y-[-2px] shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]"
                            >
                                Join Google Meet
                            </a>
                        </div>
                    )}
                </div>

                <button 
                    type="button" 
                    onClick={() => {
                        setBookedSession(null);
                        setSelectedDate(null);
                        setSelectedSlot(null);
                        setShowBookingForm(false);
                        setName('');
                        setEmail('');
                        setNotes('');
                    }} 
                    className="text-xs uppercase underline tracking-wider font-semibold text-black/50 hover:text-black dark:text-white/50 dark:hover:text-white transition-colors"
                >
                    Schedule another call
                </button>
            </div>
        );
    }

    return (
        <div className="border-2 border-black dark:border-white rounded-none overflow-hidden grid grid-cols-1 lg:grid-cols-[1.2fr_1fr] bg-white dark:bg-zinc-950/80 shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] dark:shadow-[6px_6px_0px_0px_rgba(255,255,255,1)]">
            {/* Date Section */}
            <div className="p-6 md:p-8 border-b lg:border-b-0 lg:border-r pf-border flex flex-col">
                <div className="flex items-center justify-between mb-6">
                    <h3 className="font-bold tracking-tight flex items-center gap-2">
                        <Calendar className="w-4 h-4 text-[#ff6bff]" />
                        <span>Select a Date</span>
                    </h3>
                    <div className="flex items-center gap-1">
                        <button type="button" onClick={prevMonth} className="p-2 hover:bg-black/5 dark:hover:bg-white/5 rounded-lg transition-all text-black dark:text-white">
                            <ChevronLeft className="w-4 h-4" />
                        </button>
                        <span className="text-xs uppercase font-semibold tracking-wider px-2 select-none">
                            {currentMonth.toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}
                        </span>
                        <button type="button" onClick={nextMonth} className="p-2 hover:bg-black/5 dark:hover:bg-white/5 rounded-lg transition-all text-black dark:text-white">
                            <ChevronRight className="w-4 h-4" />
                        </button>
                    </div>
                </div>

                <div className="grid grid-cols-7 gap-1 text-center text-[10px] font-bold tracking-widest uppercase text-black/40 dark:text-white/30 mb-2">
                    <div>Sun</div><div>Mon</div><div>Tue</div><div>Wed</div><div>Thu</div><div>Fri</div><div>Sat</div>
                </div>
                <div className="grid grid-cols-7 gap-1.5 flex-1">
                    {renderCalendarGrid()}
                </div>
            </div>

            {/* Slots / Form Section */}
            <div className="p-6 md:p-8 bg-white dark:bg-zinc-900 flex flex-col min-h-[380px] border-t lg:border-t-0 lg:border-l border-2 border-black dark:border-white/20">
                {!selectedDate ? (
                    <div className="flex-1 flex flex-col items-center justify-center text-center p-4">
                        <div className="w-12 h-12 rounded-none border-2 border-dashed border-black/30 dark:border-white/30 flex items-center justify-center mb-4 text-black/40 dark:text-white/40">
                            <Calendar className="w-5 h-5" />
                        </div>
                        <p className="text-sm font-bold text-black/50 dark:text-white/40">
                            Pick a date on the calendar grid to reveal available discovery hours.
                        </p>
                    </div>
                ) : loadingSlots ? (
                    <div className="flex-1 flex flex-col items-center justify-center text-center">
                        <RefreshCcw className="w-6 h-6 text-[#ff6bff] animate-spin mb-3" />
                        <span className="text-xs font-bold uppercase tracking-wider text-black/40 dark:text-white/40">Pulling vacancy logs...</span>
                    </div>
                ) : !showBookingForm ? (
                    <div className="flex flex-col h-full">
                        <h4 className="font-bold mb-1 tracking-tight">Available Times</h4>
                        <p className="text-xs text-black/40 dark:text-white/40 mb-6">
                            Showing local times for {selectedDate.toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' })}.
                        </p>

                        {slots.length === 0 ? (
                            <div className="flex-1 flex flex-col items-center justify-center text-center">
                                <p className="text-sm font-bold text-black/60 dark:text-white/50">
                                    No vacancy windows detected on this date.
                                </p>
                                <p className="text-xs text-black/40 dark:text-white/30 mt-1">
                                    Please try selecting a standard working day.
                                </p>
                            </div>
                        ) : (
                            <>
                                <div className="grid grid-cols-2 gap-3 flex-1 overflow-y-auto max-h-[280px] pr-1">
                                    {slots.map((slot) => {
                                        const isActive = selectedSlot === slot.time;
                                        return (
                                            <button
                                                key={slot.time}
                                                type="button"
                                                onClick={() => setSelectedSlot(slot.time)}
                                                className={`py-3 rounded-none text-xs font-bold tracking-wider border-2 transition-all 
                                                    ${isActive
                                                        ? 'bg-[#3DDC97] text-black border-black dark:border-white shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] scale-[1.01]'
                                                        : 'bg-white dark:bg-zinc-950 text-black dark:text-white border-black dark:border-white/20 hover:border-black dark:hover:border-white hover:bg-[#FA76FF] hover:text-black hover:translate-y-[-1px] hover:shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]'
                                                    }`}
                                            >
                                                {slot.label}
                                            </button>
                                        );
                                    })}
                                </div>
                                
                                {selectedSlot && (
                                    <button
                                        type="button"
                                        onClick={() => setShowBookingForm(true)}
                                        className="w-full bg-[#ff6bff] text-black font-bold text-xs uppercase py-4 rounded-none border-2 border-black dark:border-white tracking-widest mt-6 hover:translate-y-[-2px] shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] dark:shadow-[4px_4px_0px_0px_rgba(255,255,255,1)] hover:shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] transition-all duration-300"
                                    >
                                        Confirm Time Slot
                                    </button>
                                )}
                            </>
                        )}
                    </div>
                ) : (
                    <form onSubmit={handleBookingSubmit} className="flex flex-col h-full">
                        <div className="flex items-center justify-between mb-4 pb-3 border-b-2 border-dashed border-black dark:border-white/20">
                            <div>
                                <h4 className="text-xs font-bold uppercase tracking-wider text-[#ff6bff]">Securing Slot</h4>
                                <p className="text-sm font-bold mt-0.5">
                                    {selectedDate.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })} @ {slots.find(s => s.time === selectedSlot)?.label}
                                </p>
                            </div>
                            <button 
                                type="button" 
                                onClick={() => setShowBookingForm(false)}
                                className="text-[10px] uppercase underline font-bold opacity-50 hover:opacity-100 transition-opacity"
                            >
                                Back
                            </button>
                        </div>

                        <div className="space-y-4 flex-1">
                            <div>
                                <label className="block text-[10px] uppercase tracking-widest font-bold text-black/60 dark:text-white/50 mb-1.5 flex items-center gap-1.5">
                                    <User className="w-3 h-3 text-[#ff6bff]" /> Name
                                </label>
                                <input
                                    type="text"
                                    required
                                    placeholder="e.g., Alex Doe"
                                    value={name}
                                    onChange={e => setName(e.target.value)}
                                    className="w-full bg-white dark:bg-zinc-950 border-2 border-black dark:border-white rounded-none px-4 py-2.5 text-sm focus:bg-[#FFF8DC] focus:border-[#FA76FF] outline-none text-black dark:text-white transition-all"
                                />
                            </div>

                            <div>
                                <label className="block text-[10px] uppercase tracking-widest font-bold text-black/60 dark:text-white/50 mb-1.5 flex items-center gap-1.5">
                                    <Mail className="w-3 h-3 text-[#ff6bff]" /> Email
                                </label>
                                <input
                                    type="email"
                                    required
                                    placeholder="alex@example.com"
                                    value={email}
                                    onChange={e => setEmail(e.target.value)}
                                    className="w-full bg-white dark:bg-zinc-950 border-2 border-black dark:border-white rounded-none px-4 py-2.5 text-sm focus:bg-[#FFF8DC] focus:border-[#FA76FF] outline-none text-black dark:text-white transition-all"
                                />
                            </div>

                            <div>
                                <label className="block text-[10px] uppercase tracking-widest font-bold text-black/60 dark:text-white/50 mb-1.5 flex items-center gap-1.5">
                                    <MessageSquare className="w-3 h-3 text-[#ff6bff]" /> Topics (Optional)
                                </label>
                                <textarea
                                    rows={2}
                                    placeholder="Tell me briefly what we'll discuss!"
                                    value={notes}
                                    onChange={e => setNotes(e.target.value)}
                                    className="w-full bg-white dark:bg-zinc-950 border-2 border-black dark:border-white rounded-none px-4 py-2.5 text-sm focus:bg-[#FFF8DC] focus:border-[#FA76FF] outline-none text-black dark:text-white transition-all resize-none"
                                />
                            </div>
                        </div>

                        <button
                            type="submit"
                            disabled={bookingLoading}
                            className="w-full bg-black text-white dark:bg-white dark:text-black border-2 border-black dark:border-white font-bold text-xs uppercase py-4 rounded-none tracking-widest mt-6 hover:translate-y-[-2px] shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] dark:shadow-[4px_4px_0px_0px_rgba(255,255,255,1)] hover:shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] flex items-center justify-center gap-2 transition-all duration-300"
                        >
                            {bookingLoading ? (
                                <>
                                    <RefreshCcw className="w-3.5 h-3.5 animate-spin" />
                                    Syncing with Meet...
                                </>
                            ) : (
                                'Book My Discovery Call'
                            )}
                        </button>
                    </form>
                )}
            </div>
        </div>
    );
};
