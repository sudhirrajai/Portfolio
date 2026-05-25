import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, Link, useForm, router, usePage } from '@inertiajs/react';
import { useState, useEffect } from 'react';
import { Calendar as CalendarIcon, Clock, CheckCircle2, AlertCircle, Trash2, ExternalLink, Settings, ListOrdered, RefreshCw, LogOut } from 'lucide-react';
import { toast } from 'sonner';
import { DeleteConfirmModal } from '@/Components/DeleteConfirmModal';

export default function Index({ auth, bookings, settings, isGoogleConnected, googleAccountEmail }) {
    const { props } = usePage();
    const [activeTab, setActiveTab] = useState('agenda'); // agenda or settings
    const [deleteId, setDeleteId] = useState(null);
    const [isRevoking, setIsRevoking] = useState(false);

    // Auto-toast server redirect errors (e.g., missing .env config)
    useEffect(() => {
        if (props.errors && props.errors.error) {
            toast.error(props.errors.error);
        }
    }, [props.errors]);

    // Setup standard availability settings form
    const { data, setData, put, processing, errors } = useForm({
        is_active: settings?.is_active ?? true,
        days_of_week: settings?.days_of_week || ['monday', 'tuesday', 'wednesday', 'thursday', 'friday'],
        work_hours_start: settings?.work_hours_start || '09:00:00',
        work_hours_end: settings?.work_hours_end || '17:00:00',
        slot_duration: settings?.slot_duration || 30,
        google_client_id: settings?.google_client_id || '',
        google_client_secret: settings?.google_client_secret || '',
    });

    const handleDayToggle = (day) => {
        if (data.days_of_week.includes(day)) {
            setData('days_of_week', data.days_of_week.filter(d => d !== day));
        } else {
            setData('days_of_week', [...data.days_of_week, day]);
        }
    };

    const submitSettings = (e) => {
        e.preventDefault();
        put(route('admin.bookings.settings'), {
            preserveScroll: true,
            onSuccess: () => toast.success('Availability hours updated successfully!'),
        });
    };

    const handleConfirmDelete = () => {
        if (!deleteId) return;
        router.delete(route('admin.bookings.destroy', deleteId), {
            preserveScroll: true,
            onSuccess: () => {
                toast.success('Meeting log removed from agenda.');
                setDeleteId(null);
            },
            onError: () => setDeleteId(null)
        });
    };

    const handleRevokeConnection = () => {
        setIsRevoking(true);
        router.post(route('admin.google.revoke'), {}, {
            onSuccess: () => {
                toast.success('Successfully disconnected Google integration.');
                setIsRevoking(false);
            },
            onFinish: () => setIsRevoking(false)
        });
    };

    const dayLabels = {
        monday: 'Monday',
        tuesday: 'Tuesday',
        wednesday: 'Wednesday',
        thursday: 'Thursday',
        friday: 'Friday',
        saturday: 'Saturday',
        sunday: 'Sunday'
    };

    return (
        <AuthenticatedLayout
            header={
                <div className="flex justify-between items-center">
                    <h2 className="text-xl font-semibold leading-tight text-gray-800 dark:text-gray-200">
                        Bookings & Scheduling
                    </h2>
                    <div className="flex items-center gap-2 bg-gray-100 dark:bg-gray-850 p-1 rounded-lg border border-gray-200 dark:border-gray-800">
                        <button
                            onClick={() => setActiveTab('agenda')}
                            className={`flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-md transition-all ${
                                activeTab === 'agenda'
                                    ? 'bg-white dark:bg-gray-800 text-indigo-600 dark:text-indigo-400 shadow-sm'
                                    : 'text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300'
                            }`}
                        >
                            <ListOrdered className="w-3.5 h-3.5" />
                            Agenda
                        </button>
                        <button
                            onClick={() => setActiveTab('settings')}
                            className={`flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-md transition-all ${
                                activeTab === 'settings'
                                    ? 'bg-white dark:bg-gray-800 text-indigo-600 dark:text-indigo-400 shadow-sm'
                                    : 'text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300'
                            }`}
                        >
                            <Settings className="w-3.5 h-3.5" />
                            Availability
                        </button>
                    </div>
                </div>
            }
        >
            <Head title="Bookings & Agenda" />

            <div className="max-w-7xl mx-auto py-6">
                {activeTab === 'agenda' ? (
                    <div className="space-y-6">
                        {/* Stats Bar */}
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                            <div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-xl p-5 flex items-center gap-4 shadow-sm">
                                <div className="p-3 bg-indigo-50 dark:bg-indigo-950/30 text-indigo-600 dark:text-indigo-400 rounded-xl">
                                    <CalendarIcon className="w-6 h-6" />
                                </div>
                                <div>
                                    <div className="text-sm text-gray-500 dark:text-gray-400">Total Inquiries</div>
                                    <div className="text-2xl font-bold text-gray-900 dark:text-white">{bookings.total || 0}</div>
                                </div>
                            </div>

                            <div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-xl p-5 flex items-center gap-4 shadow-sm">
                                {isGoogleConnected ? (
                                    <>
                                        <div className="p-3 bg-emerald-50 dark:bg-emerald-950/30 text-emerald-600 dark:text-emerald-400 rounded-xl">
                                            <CheckCircle2 className="w-6 h-6" />
                                        </div>
                                        <div>
                                            <div className="text-sm text-gray-500 dark:text-gray-400">Google Meet Sync</div>
                                            <div className="text-sm font-semibold text-emerald-600 dark:text-emerald-400 truncate max-w-[180px] md:max-w-[250px]" title={googleAccountEmail}>
                                                Connected
                                            </div>
                                        </div>
                                    </>
                                ) : (
                                    <>
                                        <div className="p-3 bg-amber-50 dark:bg-amber-950/30 text-amber-500 dark:text-amber-400 rounded-xl animate-pulse">
                                            <AlertCircle className="w-6 h-6" />
                                        </div>
                                        <div>
                                            <div className="text-sm text-gray-500 dark:text-gray-400">Google Meet Sync</div>
                                            <div className="text-sm font-semibold text-amber-600 dark:text-amber-400">
                                                Action Required
                                            </div>
                                        </div>
                                    </>
                                )}
                            </div>

                            <div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-xl p-5 flex items-center gap-4 shadow-sm">
                                <div className="p-3 bg-indigo-50 dark:bg-indigo-950/30 text-indigo-600 dark:text-indigo-400 rounded-xl">
                                    <Clock className="w-6 h-6" />
                                </div>
                                <div>
                                    <div className="text-sm text-gray-500 dark:text-gray-400">Working Grid</div>
                                    <div className="text-sm font-semibold text-gray-900 dark:text-white">
                                        {data.work_hours_start.substring(0,5)} — {data.work_hours_end.substring(0,5)} ({data.slot_duration}m)
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Bookings Agenda List */}
                        <div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 shadow-sm rounded-xl overflow-hidden">
                            <div className="p-6 border-b border-gray-200 dark:border-gray-800">
                                <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Upcoming Meetings</h3>
                                <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                                    View details, attendees, and direct Google Meet conferencing pipelines.
                                </p>
                            </div>
                            <div className="overflow-x-auto">
                                <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-800">
                                    <thead className="bg-gray-50 dark:bg-gray-850">
                                        <tr>
                                            <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider dark:text-gray-400">Client Name</th>
                                            <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider dark:text-gray-400">Scheduled At</th>
                                            <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider dark:text-gray-400">Meet Link</th>
                                            <th className="px-6 py-4 text-right text-xs font-semibold text-gray-500 uppercase tracking-wider dark:text-gray-400">Actions</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-gray-200 dark:divide-gray-800">
                                        {bookings.data?.length === 0 ? (
                                            <tr>
                                                <td colSpan={4} className="px-6 py-12 text-center text-sm text-gray-500">
                                                    No appointments booked on your calendar yet!
                                                </td>
                                            </tr>
                                        ) : (
                                            bookings.data?.map((booking) => (
                                                <tr key={booking.id} className="hover:bg-gray-50/80 dark:hover:bg-gray-800/30 transition-colors">
                                                    <td className="px-6 py-4">
                                                        <div className="text-sm font-medium text-gray-900 dark:text-white">{booking.name}</div>
                                                        <div className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">{booking.email}</div>
                                                    </td>
                                                    <td className="px-6 py-4 whitespace-nowrap">
                                                        <div className="text-sm text-gray-900 dark:text-white">
                                                            {new Date(booking.scheduled_at).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                                                        </div>
                                                        <div className="text-xs text-indigo-600 dark:text-indigo-400 font-medium mt-0.5">
                                                            {new Date(booking.scheduled_at).toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })}
                                                        </div>
                                                    </td>
                                                    <td className="px-6 py-4 whitespace-nowrap">
                                                        {booking.google_meet_url ? (
                                                            <a 
                                                                href={booking.google_meet_url} 
                                                                target="_blank" 
                                                                rel="noreferrer" 
                                                                className="inline-flex items-center gap-1.5 text-xs font-medium text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/20 border border-emerald-100 dark:border-emerald-900/30 px-2.5 py-1 rounded-md hover:bg-emerald-100 transition-colors"
                                                            >
                                                                <ExternalLink className="w-3 h-3" />
                                                                Open Google Meet
                                                            </a>
                                                        ) : (
                                                            <span className="text-xs text-gray-400 italic">
                                                                Not generated
                                                            </span>
                                                        )}
                                                    </td>
                                                    <td className="px-6 py-4 whitespace-nowrap text-right">
                                                        <button
                                                            onClick={() => setDeleteId(booking.id)}
                                                            className="text-gray-400 hover:text-red-600 dark:hover:text-red-400 p-2 hover:bg-red-50 dark:hover:bg-red-950/20 rounded-lg transition-all"
                                                        >
                                                            <Trash2 className="w-4 h-4" />
                                                        </button>
                                                    </td>
                                                </tr>
                                            ))
                                        )}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                        {/* Configuration Controls */}
                        <div className="lg:col-span-2 space-y-6">
                            <div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 shadow-sm rounded-xl overflow-hidden">
                                <div className="p-6 border-b border-gray-200 dark:border-gray-800">
                                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Standard Working Hours</h3>
                                    <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                                        Control which days and hourly limits visitors see on your calendar.
                                    </p>
                                </div>
                                <form onSubmit={submitSettings} className="p-6 space-y-6">
                                    {/* Master Enable/Disable Switch */}
                                    <div className="p-4 bg-gray-50 dark:bg-gray-850/50 border border-gray-200 dark:border-gray-800 rounded-xl flex items-center justify-between group">
                                        <div className="flex flex-col pr-4">
                                            <label className="text-sm font-bold text-gray-900 dark:text-white group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors select-none cursor-pointer flex items-center gap-1.5">
                                                Allow Public Booking Sessions
                                            </label>
                                            <p className="text-xs text-gray-500 mt-0.5">
                                                When off, the "Book Call" section disappears entirely from your public portfolio!
                                            </p>
                                        </div>
                                        <button
                                            type="button"
                                            onClick={() => setData('is_active', !data.is_active)}
                                            className={`relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none ${
                                                data.is_active ? 'bg-indigo-600' : 'bg-gray-200 dark:bg-gray-700'
                                            }`}
                                        >
                                            <span
                                                className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out ${
                                                    data.is_active ? 'translate-x-5' : 'translate-x-0'
                                                }`}
                                            />
                                        </button>
                                    </div>

                                    {/* Days of the week */}
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">Available Days</label>
                                        <div className="flex flex-wrap gap-2">
                                            {Object.keys(dayLabels).map((day) => {
                                                const isChecked = data.days_of_week.includes(day);
                                                return (
                                                    <button
                                                        key={day}
                                                        type="button"
                                                        onClick={() => handleDayToggle(day)}
                                                        className={`px-3.5 py-2 text-xs font-semibold border rounded-lg transition-all ${
                                                            isChecked
                                                                ? 'bg-indigo-50 border-indigo-200 text-indigo-700 dark:bg-indigo-950/30 dark:border-indigo-900 dark:text-indigo-400'
                                                                : 'bg-gray-50 border-gray-200 text-gray-500 hover:border-gray-300 hover:text-gray-700 dark:bg-gray-850 dark:border-gray-800 dark:text-gray-400 dark:hover:border-gray-700'
                                                        }`}
                                                    >
                                                        {dayLabels[day]}
                                                    </button>
                                                );
                                            })}
                                        </div>
                                    </div>

                                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Work Day Starts</label>
                                            <input
                                                type="time"
                                                value={data.work_hours_start}
                                                onChange={(e) => setData('work_hours_start', e.target.value)}
                                                className="mt-1.5 block w-full rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-850 text-gray-900 dark:text-white px-3 py-2.5 focus:border-indigo-500 focus:ring-indigo-500 text-sm transition-all"
                                            />
                                        </div>
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Work Day Ends</label>
                                            <input
                                                type="time"
                                                value={data.work_hours_end}
                                                onChange={(e) => setData('work_hours_end', e.target.value)}
                                                className="mt-1.5 block w-full rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-850 text-gray-900 dark:text-white px-3 py-2.5 focus:border-indigo-500 focus:ring-indigo-500 text-sm transition-all"
                                            />
                                        </div>
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Slot Duration</label>
                                            <select
                                                value={data.slot_duration}
                                                onChange={(e) => setData('slot_duration', parseInt(e.target.value))}
                                                className="mt-1.5 block w-full rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-850 text-gray-900 dark:text-white px-3 py-2.5 focus:border-indigo-500 focus:ring-indigo-500 text-sm transition-all"
                                            >
                                                <option value={15}>15 minutes</option>
                                                <option value={30}>30 minutes</option>
                                                <option value={45}>45 minutes</option>
                                                <option value={60}>1 hour</option>
                                            </select>
                                        </div>
                                    </div>

                                    <div className="flex justify-end pt-2 border-t border-gray-200 dark:border-gray-800">
                                        <button
                                            type="submit"
                                            disabled={processing}
                                            className="bg-indigo-600 text-white font-semibold text-sm px-5 py-2.5 rounded-lg hover:bg-indigo-700 transition-all disabled:opacity-50 shadow-sm"
                                        >
                                            {processing ? 'Saving Hours...' : 'Save Availability Hours'}
                                        </button>
                                    </div>
                                </form>
                            </div>

                            {/* Google API Integration Configuration Card */}
                            <div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 shadow-sm rounded-xl overflow-hidden">
                                <div className="p-6 border-b border-gray-200 dark:border-gray-800">
                                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Google OAuth Credentials</h3>
                                    <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                                        Configure API keys to enable Google Calendar integrations and automated Google Meet generation.
                                    </p>
                                </div>
                                <form onSubmit={submitSettings} className="p-6 space-y-6">
                                    <div className="grid grid-cols-1 gap-5">
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Google Client ID</label>
                                            <input
                                                type="text"
                                                value={data.google_client_id}
                                                onChange={(e) => setData('google_client_id', e.target.value)}
                                                placeholder="Enter Google Client ID"
                                                className="mt-1.5 block w-full rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-850 text-gray-900 dark:text-white px-3 py-2.5 focus:border-indigo-500 focus:ring-indigo-500 text-sm transition-all font-mono"
                                            />
                                            {errors.google_client_id && <div className="text-red-500 text-xs mt-1">{errors.google_client_id}</div>}
                                        </div>
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Google Client Secret</label>
                                            <input
                                                type="password"
                                                value={data.google_client_secret}
                                                onChange={(e) => setData('google_client_secret', e.target.value)}
                                                placeholder="Enter Google Client Secret"
                                                className="mt-1.5 block w-full rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-850 text-gray-900 dark:text-white px-3 py-2.5 focus:border-indigo-500 focus:ring-indigo-500 text-sm transition-all font-mono"
                                            />
                                            {errors.google_client_secret && <div className="text-red-500 text-xs mt-1">{errors.google_client_secret}</div>}
                                        </div>
                                    </div>

                                    {/* Setup Instructions Card */}
                                    <div className="p-5 bg-blue-50/50 dark:bg-blue-950/10 border border-blue-100 dark:border-blue-900/30 rounded-xl space-y-3">
                                        <h4 className="text-xs font-bold text-blue-700 dark:text-blue-400 uppercase tracking-wider flex items-center gap-1.5">
                                            <AlertCircle className="w-4 h-4 animate-pulse" /> Setup Instructions
                                        </h4>
                                        <div className="text-xs text-gray-600 dark:text-gray-300 space-y-2 leading-relaxed">
                                            <p>1. Go to the <a href="https://console.cloud.google.com/" target="_blank" rel="noopener noreferrer" className="font-semibold text-blue-600 dark:text-blue-400 hover:underline inline-flex items-center gap-0.5">Google Cloud Console <ExternalLink className="w-2.5 h-2.5" /></a> and select or create a project.</p>
                                            <p>2. Search for <strong>Google Calendar API</strong> and click <strong>Enable</strong>.</p>
                                            <p>3. Set up your <strong>OAuth Consent Screen</strong> (External) and add your Gmail as a Test User.</p>
                                            <p>4. Go to <strong>Credentials</strong> &rarr; <strong>Create Credentials</strong> &rarr; <strong>OAuth Client ID</strong> (Web Application).</p>
                                            <p>5. Under <strong>Authorized redirect URIs</strong>, add precisely:
                                                <code className="block mt-1.5 p-2.5 bg-white dark:bg-gray-800 rounded border border-gray-200 dark:border-gray-750 font-mono text-indigo-600 dark:text-indigo-400 select-all cursor-pointer">
                                                    {typeof window !== 'undefined' ? window.location.origin : 'https://sudhir.socialspecta.com'}/admin/google/callback
                                                </code>
                                            </p>
                                        </div>
                                    </div>

                                    <div className="flex justify-end pt-2 border-t border-gray-200 dark:border-gray-800">
                                        <button
                                            type="submit"
                                            disabled={processing}
                                            className="bg-indigo-600 text-white font-semibold text-sm px-5 py-2.5 rounded-lg hover:bg-indigo-700 transition-all disabled:opacity-50 shadow-sm"
                                        >
                                            {processing ? 'Saving Configurations...' : 'Save Google Credentials'}
                                        </button>
                                    </div>
                                </form>
                            </div>
                        </div>

                        {/* Integration Sidebar Card */}
                        <div className="space-y-6">
                            <div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 shadow-sm rounded-xl overflow-hidden">
                                <div className="p-6 bg-gray-50/50 dark:bg-gray-850/50 border-b border-gray-200 dark:border-gray-800 flex items-center gap-3">
                                    <div className="p-2 bg-white dark:bg-gray-900 rounded-lg border border-gray-100 dark:border-gray-800">
                                        <svg className="w-5 h-5 text-blue-500" viewBox="0 0 24 24">
                                            <path fill="currentColor" d="M21.35,11.1H12v3.8h5.38c-0.23,1.25 -0.94,2.31 -2,3.03L18.75,22c1.93,-1.78 3.05,-4.4 3.05,-7.5C21.8,13.42 21.64,12.2 21.35,11.1z"/>
                                            <path fill="#34A853" d="M12,24c3.24,0 5.95,-1.08 7.93,-2.91l-3.37,-2.62c-0.93,0.63 -2.13,1 -3.56,1 -2.73,0 -5.05,-1.85 -5.87,-4.33l-3.48,2.7C3.37,21.44 7.34,24 12,24z"/>
                                            <path fill="#FBBC05" d="M6.13,15.14c-0.21,-0.63 -0.33,-1.3 -0.33,-2c0,-0.7 0.12,-1.37 0.33,-2l-3.48,-2.7C2.1,9.57 1.8,10.75 1.8,12c0,1.25 0.3,2.43 0.85,3.56L6.13,15.14z"/>
                                            <path fill="#EA4335" d="M12,4.75c1.77,0 3.35,0.61 4.6,1.8l3.42,-3.42C17.93,1.19 15.22,0 12,0 7.34,0 3.37,2.56 1.65,6.44l3.48,2.7C5.95,6.6 8.27,4.75 12,4.75z"/>
                                        </svg>
                                    </div>
                                    <div>
                                        <h4 className="text-sm font-bold text-gray-900 dark:text-white">Google Calendar</h4>
                                        <p className="text-xs text-gray-500 dark:text-gray-400">Google Meet integration</p>
                                    </div>
                                </div>
                                <div className="p-6 space-y-4">
                                    {isGoogleConnected ? (
                                        <>
                                            <div className="p-4 border border-emerald-100 dark:border-emerald-900/30 bg-emerald-50/50 dark:bg-emerald-950/10 rounded-lg flex flex-col items-center text-center">
                                                <CheckCircle2 className="w-8 h-8 text-emerald-500 mb-2" />
                                                <div className="text-xs font-bold text-emerald-700 dark:text-emerald-400 uppercase tracking-wider">Account Synced</div>
                                                <div className="text-sm text-gray-600 dark:text-gray-300 font-medium break-all mt-1">{googleAccountEmail}</div>
                                            </div>
                                            <p className="text-xs text-gray-500 leading-relaxed dark:text-gray-400">
                                                Your account has granted offline syncing capabilities. Unique Google Meet links will automatically populate user appointments upon submission.
                                            </p>
                                            <div className="pt-2">
                                                <button
                                                    onClick={handleRevokeConnection}
                                                    disabled={isRevoking}
                                                    className="w-full py-2.5 text-center text-xs font-semibold text-red-600 border border-red-200 hover:bg-red-50 dark:border-red-900/30 dark:hover:bg-red-950/30 rounded-lg transition-all inline-flex items-center justify-center gap-2"
                                                >
                                                    {isRevoking ? <RefreshCw className="w-3 h-3 animate-spin" /> : <LogOut className="w-3.5 h-3.5" />}
                                                    Disconnect Account
                                                </button>
                                            </div>
                                        </>
                                    ) : (
                                        <>
                                            <div className="p-4 border border-amber-100 dark:border-amber-900/30 bg-amber-50/30 dark:bg-amber-950/10 rounded-lg flex flex-col items-center text-center">
                                                <AlertCircle className="w-8 h-8 text-amber-500 mb-2 animate-pulse" />
                                                <div className="text-xs font-bold text-amber-600 dark:text-amber-500 uppercase tracking-wider">Disconnected</div>
                                                <p className="text-xs text-gray-500 mt-1.5">
                                                    Connect to your Google account to auto-generate Google Meet conferencing codes!
                                                </p>
                                            </div>
                                            <div className="pt-2">
                                                <Link
                                                    href={route('admin.google.connect')}
                                                    className="w-full py-2.5 text-center text-sm font-semibold text-white bg-blue-600 hover:bg-blue-700 rounded-lg transition-all inline-flex items-center justify-center gap-2 shadow-sm shadow-blue-500/10"
                                                >
                                                    <svg className="w-4 h-4 text-white" viewBox="0 0 24 24">
                                                        <path fill="currentColor" d="M21.35,11.1H12v3.8h5.38c-0.23,1.25 -0.94,2.31 -2,3.03L18.75,22c1.93,-1.78 3.05,-4.4 3.05,-7.5C21.8,13.42 21.64,12.2 21.35,11.1z"/>
                                                        <path fill="currentColor" d="M12,24c3.24,0 5.95,-1.08 7.93,-2.91l-3.37,-2.62c-0.93,0.63 -2.13,1 -3.56,1 -2.73,0 -5.05,-1.85 -5.87,-4.33l-3.48,2.7C3.37,21.44 7.34,24 12,24z"/>
                                                        <path fill="currentColor" d="M6.13,15.14c-0.21,-0.63 -0.33,-1.3 -0.33,-2c0,-0.7 0.12,-1.37 0.33,-2l-3.48,-2.7C2.1,9.57 1.8,10.75 1.8,12c0,1.25 0.3,2.43 0.85,3.56L6.13,15.14z"/>
                                                        <path fill="currentColor" d="M12,4.75c1.77,0 3.35,0.61 4.6,1.8l3.42,-3.42C17.93,1.19 15.22,0 12,0 7.34,0 3.37,2.56 1.65,6.44l3.48,2.7C5.95,6.6 8.27,4.75 12,4.75z"/>
                                                    </svg>
                                                    Connect Google Account
                                                </Link>
                                            </div>
                                        </>
                                    )}
                                </div>
                            </div>
                        </div>
                    </div>
                )}
            </div>

            {/* Confirmation Dialog */}
            <DeleteConfirmModal
                isOpen={!!deleteId}
                onClose={() => setDeleteId(null)}
                onConfirm={handleConfirmDelete}
                title="Remove Meeting Log"
                message="Are you sure you want to remove this record from your dashboard log? Note: this doesn't automatically delete the meeting from your actual Google Calendar if synced."
            />
        </AuthenticatedLayout>
    );
}
