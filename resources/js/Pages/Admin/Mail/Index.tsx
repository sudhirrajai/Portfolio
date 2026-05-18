import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, useForm, usePage } from '@inertiajs/react';
import { useState, useEffect } from 'react';
import { Mail, Server, ShieldCheck, Send, CheckCircle, AlertTriangle, Eye, EyeOff, RefreshCw } from 'lucide-react';
import { toast } from 'sonner';

export default function Index({ auth, settings }) {
    const { props } = usePage();
    const [showPassword, setShowPassword] = useState(false);
    const [testEmail, setTestEmail] = useState('');
    const [isTesting, setIsTesting] = useState(false);

    // 1. Standard Configuration settings Form
    const { data, setData, put, processing, errors } = useForm({
        host: settings?.host || '',
        port: settings?.port || 587,
        username: settings?.username || '',
        password: settings?.password || '',
        encryption: settings?.encryption || 'tls',
        from_address: settings?.from_address || '',
        from_name: settings?.from_name || '',
    });

    // 2. Dynamic validation listener for Test Mail responses
    useEffect(() => {
        if (props.errors && props.errors.test_error) {
            setIsTesting(false);
        }
    }, [props.errors]);

    const submitSettings = (e) => {
        e.preventDefault();
        put(route('admin.mail.update'), {
            preserveScroll: true,
            onSuccess: () => toast.success('SMTP Server config locked in successfully!'),
        });
    };

    // Handle sending the dynamic test-mail
    const handleTestMail = async (e) => {
        e.preventDefault();
        if (!testEmail) {
            toast.error('Please provide a valid destination email address!');
            return;
        }

        // Quick client-side check to make sure they've entered host details
        if (!data.host || !data.username || !data.password) {
            toast.error('Please complete the SMTP config form fields first to run a test!');
            return;
        }

        setIsTesting(true);
        
        // Leverage Inertia post router to trigger session-purged backend connection
        const { router } = await import('@inertiajs/react');
        
        router.post(route('admin.mail.test'), {
            destination_email: testEmail,
            host: data.host,
            port: data.port,
            username: data.username,
            password: data.password,
            encryption: data.encryption,
            from_address: data.from_address || data.username,
            from_name: data.from_name || 'Portfolio Server',
        }, {
            preserveScroll: true,
            onSuccess: () => {
                toast.success('Diagnostic Test Connection Succeeded! Check your email.');
                setIsTesting(false);
            },
            onError: () => {
                setIsTesting(false);
            },
            onFinish: () => {
                setIsTesting(false);
            }
        });
    };

    const isConfigured = settings && settings.host && settings.username;

    return (
        <AuthenticatedLayout
            header={
                <h2 className="text-xl font-semibold leading-tight text-gray-800 dark:text-gray-200">
                    Mail & SMTP Server Setup
                </h2>
            }
        >
            <Head title="Mail & SMTP Settings" />

            <div className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
                {/* Main Visual Status Warning Banner */}
                {!isConfigured && (
                    <div className="mb-6 p-4 bg-amber-50 dark:bg-amber-950/20 border border-amber-200 dark:border-amber-900/30 rounded-xl flex items-center gap-3 text-amber-800 dark:text-amber-400 animate-fade-in">
                        <AlertTriangle className="w-5 h-5 flex-shrink-0" />
                        <div className="text-sm font-medium">
                            SMTP Server is not configured yet. Standard system-generated client emails and meeting invites will fall back to local configurations or remain unsent.
                        </div>
                    </div>
                )}

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-start">
                    {/* Configuration Panel */}
                    <div className="lg:col-span-2 bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-xl shadow-sm overflow-hidden">
                        <div className="p-6 border-b border-gray-200 dark:border-gray-800 flex items-center gap-3">
                            <div className="p-2.5 bg-indigo-50 dark:bg-indigo-950/30 text-indigo-600 dark:text-indigo-400 rounded-lg">
                                <Server className="w-5 h-5" />
                            </div>
                            <div>
                                <h3 className="text-lg font-bold text-gray-900 dark:text-white">Server Routing Parameters</h3>
                                <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">Setup secure cloud mail pathways dynamically.</p>
                            </div>
                        </div>

                        <form onSubmit={submitSettings} className="p-6 space-y-5">
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                <div className="md:col-span-2">
                                    <label className="block text-xs font-bold text-gray-700 dark:text-gray-300 uppercase tracking-wider mb-1.5">SMTP Host</label>
                                    <input
                                        type="text"
                                        required
                                        placeholder="e.g., smtp.gmail.com or mail.yourdomain.com"
                                        value={data.host}
                                        onChange={e => setData('host', e.target.value)}
                                        className="w-full rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-850 text-gray-900 dark:text-white px-3.5 py-2.5 text-sm focus:ring-indigo-500 focus:border-indigo-500 transition-all"
                                    />
                                    {errors.host && <p className="text-xs text-red-500 mt-1">{errors.host}</p>}
                                </div>
                                <div>
                                    <label className="block text-xs font-bold text-gray-700 dark:text-gray-300 uppercase tracking-wider mb-1.5">Port</label>
                                    <input
                                        type="number"
                                        required
                                        placeholder="587"
                                        value={data.port}
                                        onChange={e => setData('port', parseInt(e.target.value) || '')}
                                        className="w-full rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-850 text-gray-900 dark:text-white px-3.5 py-2.5 text-sm focus:ring-indigo-500 focus:border-indigo-500 transition-all"
                                    />
                                    {errors.port && <p className="text-xs text-red-500 mt-1">{errors.port}</p>}
                                </div>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                <div className="md:col-span-2">
                                    <label className="block text-xs font-bold text-gray-700 dark:text-gray-300 uppercase tracking-wider mb-1.5">Mail Username (or E-mail)</label>
                                    <input
                                        type="text"
                                        required
                                        placeholder="e.g., you@gmail.com"
                                        value={data.username}
                                        onChange={e => setData('username', e.target.value)}
                                        className="w-full rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-850 text-gray-900 dark:text-white px-3.5 py-2.5 text-sm focus:ring-indigo-500 focus:border-indigo-500 transition-all"
                                    />
                                    {errors.username && <p className="text-xs text-red-500 mt-1">{errors.username}</p>}
                                </div>
                                <div>
                                    <label className="block text-xs font-bold text-gray-700 dark:text-gray-300 uppercase tracking-wider mb-1.5">Encryption</label>
                                    <select
                                        value={data.encryption}
                                        onChange={e => setData('encryption', e.target.value)}
                                        className="w-full rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-850 text-gray-900 dark:text-white px-3.5 py-2.5 text-sm focus:ring-indigo-500 focus:border-indigo-500 transition-all"
                                    >
                                        <option value="tls">TLS</option>
                                        <option value="ssl">SSL</option>
                                        <option value="none">None</option>
                                    </select>
                                    {errors.encryption && <p className="text-xs text-red-500 mt-1">{errors.encryption}</p>}
                                </div>
                            </div>

                            <div>
                                <label className="block text-xs font-bold text-gray-700 dark:text-gray-300 uppercase tracking-wider mb-1.5">Mail Password (or App Password)</label>
                                <div className="relative">
                                    <input
                                        type={showPassword ? 'text' : 'password'}
                                        required
                                        placeholder="••••••••••••••••"
                                        value={data.password}
                                        onChange={e => setData('password', e.target.value)}
                                        className="w-full rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-850 text-gray-900 dark:text-white pl-3.5 pr-10 py-2.5 text-sm focus:ring-indigo-500 focus:border-indigo-500 transition-all"
                                    />
                                    <button
                                        type="button"
                                        onClick={() => setShowPassword(!showPassword)}
                                        className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors"
                                    >
                                        {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                                    </button>
                                </div>
                                {errors.password && <p className="text-xs text-red-500 mt-1">{errors.password}</p>}
                            </div>

                            <hr className="border-gray-200 dark:border-gray-800 my-2" />

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-xs font-bold text-gray-700 dark:text-gray-300 uppercase tracking-wider mb-1.5">Sender E-mail (From)</label>
                                    <input
                                        type="email"
                                        placeholder="e.g., noreply@yourdomain.com"
                                        value={data.from_address}
                                        onChange={e => setData('from_address', e.target.value)}
                                        className="w-full rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-850 text-gray-900 dark:text-white px-3.5 py-2.5 text-sm focus:ring-indigo-500 focus:border-indigo-500 transition-all"
                                    />
                                </div>
                                <div>
                                    <label className="block text-xs font-bold text-gray-700 dark:text-gray-300 uppercase tracking-wider mb-1.5">Sender Label Name</label>
                                    <input
                                        type="text"
                                        placeholder="e.g., Sudhir Portfolio"
                                        value={data.from_name}
                                        onChange={e => setData('from_name', e.target.value)}
                                        className="w-full rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-850 text-gray-900 dark:text-white px-3.5 py-2.5 text-sm focus:ring-indigo-500 focus:border-indigo-500 transition-all"
                                    />
                                </div>
                            </div>

                            <div className="flex justify-end pt-2 border-t border-gray-200 dark:border-gray-800">
                                <button
                                    type="submit"
                                    disabled={processing}
                                    className="bg-indigo-600 text-white font-bold text-xs uppercase px-5 py-3 rounded-lg tracking-wider hover:bg-indigo-700 transition-all disabled:opacity-50 shadow-sm"
                                >
                                    {processing ? 'Saving Credentials...' : 'Lock-In SMTP Credentials'}
                                </button>
                            </div>
                        </form>
                    </div>

                    {/* Dynamic Diagnostic Testing Column */}
                    <div className="space-y-6">
                        <div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-xl shadow-sm overflow-hidden">
                            <div className="p-6 bg-gray-50/50 dark:bg-gray-850/50 border-b border-gray-200 dark:border-gray-800 flex items-center gap-3">
                                <div className="p-2 bg-white dark:bg-gray-900 rounded-lg border border-gray-200 dark:border-gray-800 text-emerald-600">
                                    <ShieldCheck className="w-5 h-5" />
                                </div>
                                <div>
                                    <h4 className="text-sm font-bold text-gray-900 dark:text-white">Diagnostics & Testing</h4>
                                    <p className="text-xs text-gray-500 dark:text-gray-400">Trigger server-to-inbox validations</p>
                                </div>
                            </div>

                            <div className="p-6 space-y-4">
                                {/* Show status box */}
                                {isConfigured ? (
                                    <div className="p-3.5 bg-emerald-50 dark:bg-emerald-950/10 border border-emerald-100 dark:border-emerald-900/30 rounded-lg flex items-center gap-3">
                                        <CheckCircle className="w-5 h-5 text-emerald-500" />
                                        <div className="text-xs font-semibold text-emerald-800 dark:text-emerald-400">
                                            Connected via {settings.host}
                                        </div>
                                    </div>
                                ) : (
                                    <div className="p-3.5 bg-gray-50 dark:bg-gray-850 border border-gray-200 dark:border-gray-800 rounded-lg flex items-center gap-3">
                                        <div className="w-2 h-2 rounded-full bg-gray-400" />
                                        <div className="text-xs font-semibold text-gray-500">
                                            Inactive / Pending Config
                                        </div>
                                    </div>
                                )}

                                <p className="text-xs text-gray-500 leading-relaxed">
                                    Enter your email address below to trigger a real diagnostic SMTP email from your server using the credentials typed above (works even before you click Save!).
                                </p>

                                <form onSubmit={handleTestMail} className="space-y-3 pt-1">
                                    <div>
                                        <label className="block text-[10px] font-bold text-gray-500 uppercase tracking-widest mb-1">Test Target Email</label>
                                        <input
                                            type="email"
                                            required
                                            placeholder="sudhir@example.com"
                                            value={testEmail}
                                            onChange={e => setTestEmail(e.target.value)}
                                            className="w-full rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-850 text-gray-900 dark:text-white px-3 py-2.5 text-sm focus:ring-emerald-500 focus:border-emerald-500 transition-all"
                                        />
                                    </div>
                                    
                                    <button
                                        type="submit"
                                        disabled={isTesting}
                                        className="w-full py-3 text-center text-xs font-bold text-white uppercase bg-emerald-600 hover:bg-emerald-700 rounded-lg shadow-sm shadow-emerald-500/10 transition-all inline-flex items-center justify-center gap-2 disabled:opacity-60"
                                    >
                                        {isTesting ? (
                                            <>
                                                <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                                                Establishing Link...
                                            </>
                                        ) : (
                                            <>
                                                <Send className="w-3.5 h-3.5" />
                                                Send Diagnostic Test
                                            </>
                                        )}
                                    </button>
                                </form>

                                {/* Diagnostic Errors Alert Panel */}
                                {props.errors && props.errors.test_error && (
                                    <div className="mt-4 p-4 bg-red-50 dark:bg-red-950/20 border border-red-200 dark:border-red-900/30 rounded-lg">
                                        <div className="flex items-center gap-2 text-red-600 dark:text-red-400 font-bold text-xs uppercase mb-1.5">
                                            <AlertTriangle className="w-4 h-4" />
                                            Test Failed
                                        </div>
                                        <p className="text-xs text-red-700 dark:text-red-400/90 font-mono break-all overflow-y-auto max-h-[120px]">
                                            {props.errors.test_error}
                                        </p>
                                        <p className="text-[10px] text-gray-500 mt-2 italic">
                                            Double-check your SMTP host, ensure your credentials are valid, and check for App Password settings!
                                        </p>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
