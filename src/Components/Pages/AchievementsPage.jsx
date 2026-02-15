import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Award, Play, CheckCircle, Clock, Trophy, BarChart2, Star, X, ChevronRight, AlertCircle, Plus } from 'lucide-react';
import { apiRequest } from '../../config/api';

const AchievementsPage = () => {
    const navigate = useNavigate();
    const [view, setView] = useState('list'); // list, test, result, create
    const [activeTest, setActiveTest] = useState(null);
    const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
    const [answers, setAnswers] = useState({});
    const [scoreData, setScoreData] = useState(null); // { score: 90, xp: 900 }

    // Data States
    const [tests, setTests] = useState([]);
    const [history, setHistory] = useState([]);
    const [loading, setLoading] = useState(true);

    // Create Quiz State
    const [newQuiz, setNewQuiz] = useState({
        title: '',
        subject: '',
        description: '',
        time_limit: 15,
        questions: []
    });

    // Helper to add question fields
    const addQuestionField = () => {
        setNewQuiz(prev => ({
            ...prev,
            questions: [...prev.questions, {
                id: Date.now(),
                text: '',
                options: ['', '', '', ''],
                correctIndex: 0
            }]
        }));
    };

    const updateQuestion = (idx, field, value) => {
        const updatedQuestions = [...newQuiz.questions];
        updatedQuestions[idx][field] = value;
        setNewQuiz(prev => ({ ...prev, questions: updatedQuestions }));
    };

    const updateOption = (qIdx, oIdx, value) => {
        const updatedQuestions = [...newQuiz.questions];
        updatedQuestions[qIdx].options[oIdx] = value;
        setNewQuiz(prev => ({ ...prev, questions: updatedQuestions }));
    };

    // Initial Data Fetch
    useEffect(() => {
        const fetchData = async () => {
            try {
                // 1. Fetch Tests
                const quizzesRes = await apiRequest('/quizzes');
                if (quizzesRes.success) {
                    // Transform backend format if needed
                    const formattedTests = quizzesRes.data.map(q => ({
                        id: q.id,
                        title: q.title,
                        subject: q.subject,
                        duration: `${q.time_limit_minutes} mins`,
                        questions: q.questions // JSONB
                    }));
                    setTests(formattedTests);
                }

                // 2. Fetch History
                const historyRes = await apiRequest('/quizzes/attempts');
                if (historyRes.success) {
                    setHistory(historyRes.data);
                }
            } catch (err) {
                console.error("Failed to load achievement data", err);
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, []);

    const startTest = (test) => {
        setActiveTest(test);
        setCurrentQuestionIndex(0);
        setAnswers({});
        setView('test');
    };

    const handleAnswer = (optionIndex) => {
        setAnswers({ ...answers, [currentQuestionIndex]: optionIndex });
    };

    const submitTest = async () => {
        try {
            const res = await apiRequest(`/quizzes/${activeTest.id}/submit`, {
                method: 'POST',
                body: JSON.stringify({ answers })
            });

            if (res.success) {
                const { percentage } = res.data;
                // Using percentage from backend
                const finalPercentage = percentage;

                setScoreData({
                    score: finalPercentage,
                    xp: finalPercentage * 10
                });

                // Refresh history
                const historyRes = await apiRequest('/quizzes/attempts');
                if (historyRes.success) setHistory(historyRes.data);

                setView('result');
            }
        } catch (error) {
            console.error("Submit failed", error);
            alert("Failed to submit test. Please try again.");
        }
    };

    const saveNewQuiz = async () => {
        if (!newQuiz.title || newQuiz.questions.length === 0) return alert("Please fill details and add questions");

        try {
            const res = await apiRequest('/quizzes', {
                method: 'POST',
                body: JSON.stringify(newQuiz)
            });

            if (res.success) {
                alert("Quiz Created Successfully!");
                setView('list');
                // Refresh list
                const quizzesRes = await apiRequest('/quizzes');
                if (quizzesRes.success) {
                    const formattedTests = quizzesRes.data.map(q => ({
                        id: q.id,
                        title: q.title,
                        subject: q.subject,
                        duration: `${q.time_limit_minutes} mins`,
                        questions: q.questions
                    }));
                    setTests(formattedTests);
                }
            }
        } catch (err) {
            alert("Failed to create quiz: " + err.message);
        }
    };

    const getTotalXP = () => history.reduce((sum, item) => sum + item.xp, 0);

    if (loading) return <div className="min-h-screen flex items-center justify-center dark:bg-gray-900 dark:text-white">Loading Achievements...</div>;

    return (
        <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex flex-col font-sans transition-colors duration-300">
            {/* Header */}
            <header className="bg-white/80 dark:bg-gray-900/80 backdrop-blur-md border-b border-gray-200 dark:border-gray-800 sticky top-0 z-10 px-6 py-4 flex items-center gap-4">
                <button onClick={() => navigate('/dashboard')} className="p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-full transition text-gray-600 dark:text-gray-400">
                    <ArrowLeft className="w-5 h-5" />
                </button>
                <div className="flex items-center gap-2 text-purple-700 dark:text-purple-400 font-bold text-xl">
                    <Award className="w-6 h-6 fill-current" />
                    <span>Achievements & Tests</span>
                </div>
            </header>

            <main className="max-w-5xl mx-auto px-6 py-8 w-full">

                {view === 'list' && (
                    <>
                        {/* XP Summary Card */}
                        <div className="bg-linear-to-r from-purple-600 to-indigo-600 rounded-3xl p-8 text-white mb-10 shadow-xl flex flex-col md:flex-row items-center justify-between gap-6">
                            <div>
                                <h2 className="text-3xl font-bold mb-2">Total XP Earned</h2>
                                <p className="opacity-90">Keep taking tests to level up!</p>
                            </div>
                            <div className="flex items-center gap-4">
                                <div className="p-4 bg-white/20 rounded-2xl backdrop-blur-sm">
                                    <Trophy className="w-8 h-8 text-yellow-300" />
                                </div>
                                <span className="text-5xl font-extrabold tracking-tight">{getTotalXP()}</span>
                            </div>
                        </div>

                        <div className="flex justify-end mb-6">
                            <button
                                onClick={() => setView('create')}
                                className="flex items-center gap-2 px-4 py-2 bg-indigo-600 text-white rounded-xl shadow hover:bg-indigo-700 transition"
                            >
                                <Plus className="w-4 h-4" /> Mentor: Create Quiz
                            </button>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                            {/* Available Tests */}
                            <section>
                                <h3 className="text-xl font-bold text-gray-800 dark:text-white mb-4 flex items-center gap-2">
                                    <Clock className="w-5 h-5 text-purple-600" /> Available Mock Tests
                                </h3>
                                <div className="space-y-4">
                                    {tests.length === 0 ? <p className="text-gray-500">No quizzes available yet.</p> :
                                        tests.map(test => (
                                            <div key={test.id} className="bg-white dark:bg-gray-800 p-5 rounded-xl border border-gray-100 dark:border-gray-700 shadow-sm hover:shadow-md transition flex items-center justify-between group">
                                                <div>
                                                    <h4 className="font-bold text-gray-800 dark:text-white">{test.title}</h4>
                                                    <p className="text-sm text-gray-500 dark:text-gray-400">{test.subject} • {test.duration} • {test.questions?.length || 0} Questions</p>
                                                </div>
                                                <button
                                                    onClick={() => startTest(test)}
                                                    className="bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-400 p-3 rounded-full hover:bg-purple-600 hover:text-white transition"
                                                >
                                                    <Play className="w-5 h-5 fill-current" />
                                                </button>
                                            </div>
                                        ))}
                                </div>
                            </section>

                            {/* Recent Activity */}
                            <section>
                                <h3 className="text-xl font-bold text-gray-800 dark:text-white mb-4 flex items-center gap-2">
                                    <BarChart2 className="w-5 h-5 text-indigo-600" /> Recent History
                                </h3>
                                <div className="space-y-4">
                                    {history.length > 0 ? (
                                        history.slice(0, 5).map(record => (
                                            <div key={record.id} className="bg-white dark:bg-gray-800 p-5 rounded-xl border border-gray-100 dark:border-gray-700 shadow-sm flex items-center justify-between">
                                                <div>
                                                    <h4 className="font-semibold text-gray-800 dark:text-white">{record.testName}</h4>
                                                    <p className="text-xs text-gray-400 dark:text-gray-500">{record.date}</p>
                                                </div>
                                                <div className="text-right">
                                                    <div className={`font-bold text-lg ${record.score >= 80 ? 'text-green-600' : record.score >= 50 ? 'text-orange-500' : 'text-red-500'}`}>
                                                        {record.score}%
                                                    </div>
                                                    <div className="text-xs font-bold text-purple-600 dark:text-purple-400">+{record.xp} XP</div>
                                                </div>
                                            </div>
                                        ))
                                    ) : (
                                        <div className="text-center p-8 bg-white dark:bg-gray-800 rounded-xl border border-dashed border-gray-200 dark:border-gray-700">
                                            <p className="text-gray-500 dark:text-gray-400">No tests taken yet.</p>
                                        </div>
                                    )}
                                </div>
                            </section>
                        </div>
                    </>
                )}

                {view === 'create' && (
                    <div className="max-w-2xl mx-auto bg-white dark:bg-gray-800 rounded-3xl p-8 shadow-xl border border-gray-100 dark:border-gray-700">
                        <div className="flex justify-between items-center mb-6">
                            <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Create New Quiz</h2>
                            <button onClick={() => setView('list')} className="text-gray-500 hover:text-gray-700 px-4">Cancel</button>
                        </div>

                        <div className="space-y-4 mb-6">
                            <input
                                className="w-full p-3 bg-gray-50 dark:bg-gray-700 rounded-xl border border-gray-200 dark:border-gray-600 focus:border-indigo-500 outline-none"
                                placeholder="Quiz Title (e.g. Physics 101)"
                                value={newQuiz.title}
                                onChange={e => setNewQuiz({ ...newQuiz, title: e.target.value })}
                            />
                            <div className="flex gap-4">
                                <input
                                    className="flex-1 p-3 bg-gray-50 dark:bg-gray-700 rounded-xl border border-gray-200 dark:border-gray-600 focus:border-indigo-500 outline-none"
                                    placeholder="Subject"
                                    value={newQuiz.subject}
                                    onChange={e => setNewQuiz({ ...newQuiz, subject: e.target.value })}
                                />
                                <input
                                    type="number"
                                    className="w-32 p-3 bg-gray-50 dark:bg-gray-700 rounded-xl border border-gray-200 dark:border-gray-600 focus:border-indigo-500 outline-none"
                                    placeholder="Mins"
                                    value={newQuiz.time_limit}
                                    onChange={e => setNewQuiz({ ...newQuiz, time_limit: parseInt(e.target.value) })}
                                />
                            </div>
                        </div>

                        <div className="space-y-6">
                            <h3 className="font-bold text-gray-700 dark:text-gray-300 border-b pb-2">Questions</h3>
                            {newQuiz.questions.map((q, idx) => (
                                <div key={q.id} className="p-4 bg-gray-50 dark:bg-gray-900/50 rounded-xl border border-gray-200 dark:border-gray-700">
                                    <div className="flex gap-2 mb-2">
                                        <span className="font-bold text-indigo-500">Q{idx + 1}</span>
                                        <input
                                            className="flex-1 bg-transparent border-b border-gray-300 dark:border-gray-600 focus:border-indigo-500 outline-none"
                                            placeholder="Enter question text..."
                                            value={q.text}
                                            onChange={e => updateQuestion(idx, 'text', e.target.value)}
                                        />
                                    </div>
                                    <div className="grid grid-cols-2 gap-2 mt-3">
                                        {q.options.map((opt, oIdx) => (
                                            <div key={oIdx} className="flex items-center gap-2">
                                                <input
                                                    type="radio"
                                                    name={`correct-${q.id}`}
                                                    checked={q.correctIndex === oIdx}
                                                    onChange={() => updateQuestion(idx, 'correctIndex', oIdx)}
                                                />
                                                <input
                                                    className="flex-1 p-1 text-sm bg-white dark:bg-gray-700 rounded border border-gray-200 dark:border-gray-600"
                                                    placeholder={`Option ${oIdx + 1}`}
                                                    value={opt}
                                                    onChange={e => updateOption(idx, oIdx, e.target.value)}
                                                />
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            ))}
                            <button
                                onClick={addQuestionField}
                                className="w-full py-3 border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-xl text-gray-500 hover:border-indigo-500 hover:text-indigo-500 transition"
                            >
                                + Add Question
                            </button>
                        </div>

                        <div className="mt-8">
                            <button
                                onClick={saveNewQuiz}
                                className="w-full py-3 bg-indigo-600 text-white font-bold rounded-xl shadow-lg hover:bg-indigo-700 transition"
                            >
                                Publish Quiz
                            </button>
                        </div>
                    </div>
                )}

                {view === 'test' && activeTest && (
                    <div className="max-w-2xl mx-auto">
                        <div className="mb-6 flex items-center justify-between">
                            <span className="text-sm font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wide">Question {currentQuestionIndex + 1} of {activeTest.questions.length}</span>
                            <button onClick={() => setView('list')} className="text-gray-400 dark:text-gray-500 hover:text-red-500"><X className="w-6 h-6" /></button>
                        </div>

                        <div className="bg-white dark:bg-gray-800 rounded-3xl p-8 shadow-lg border border-gray-100 dark:border-gray-700 mb-8">
                            <h3 className="text-2xl font-bold text-gray-800 dark:text-white mb-8">{activeTest.questions[currentQuestionIndex].text}</h3>
                            <div className="space-y-3">
                                {activeTest.questions[currentQuestionIndex].options.map((opt, idx) => (
                                    <button
                                        key={idx}
                                        onClick={() => handleAnswer(idx)}
                                        className={`w-full text-left p-4 rounded-xl border-2 transition font-medium ${answers[currentQuestionIndex] === idx ? 'border-purple-600 dark:border-purple-500 bg-purple-50 dark:bg-purple-900/20 text-purple-700 dark:text-purple-300' : 'border-gray-100 dark:border-gray-700 hover:border-purple-200 dark:hover:border-purple-900/50 text-gray-700 dark:text-gray-300'}`}
                                    >
                                        {opt}
                                    </button>
                                ))}
                            </div>
                        </div>

                        <div className="flex justify-between items-center">
                            <button
                                disabled={currentQuestionIndex === 0}
                                onClick={() => setCurrentQuestionIndex(curr => curr - 1)}
                                className="px-6 py-3 rounded-xl font-semibold text-gray-500 dark:text-gray-400 disabled:opacity-30 hover:bg-gray-100 dark:hover:bg-gray-800 transition"
                            >
                                Previous
                            </button>

                            {currentQuestionIndex < activeTest.questions.length - 1 ? (
                                <button
                                    onClick={() => setCurrentQuestionIndex(curr => curr + 1)}
                                    className="px-6 py-3 bg-purple-600 text-white rounded-xl font-bold hover:bg-purple-700 transition flex items-center gap-2 shadow-md"
                                >
                                    Next Question <ChevronRight className="w-4 h-4" />
                                </button>
                            ) : (
                                <button
                                    onClick={submitTest}
                                    className="px-8 py-3 bg-green-600 text-white rounded-xl font-bold hover:bg-green-700 transition flex items-center gap-2 shadow-md"
                                >
                                    Submit Test <CheckCircle className="w-5 h-5" />
                                </button>
                            )}
                        </div>
                    </div>
                )}

                {view === 'result' && scoreData && (
                    <div className="max-w-md mx-auto text-center pt-10 animate-in zoom-in duration-500">
                        <div className="inline-block p-6 rounded-full bg-yellow-100 dark:bg-yellow-900/30 mb-6 relative">
                            <Trophy className="w-16 h-16 text-yellow-500" />
                            <div className="absolute top-0 right-0 animate-bounce">
                                <Star className="w-8 h-8 text-yellow-400 fill-current" />
                            </div>
                        </div>
                        <h2 className="text-3xl font-extrabold text-gray-900 dark:text-white mb-2">Test Completed!</h2>
                        <p className="text-gray-500 dark:text-gray-400 mb-8">You finished {activeTest.title}</p>

                        <div className="bg-white dark:bg-gray-800 rounded-2xl p-8 shadow-xl border border-gray-100 dark:border-gray-700 mb-8">
                            <div className="text-sm text-gray-500 dark:text-gray-400 uppercase tracking-widest font-semibold mb-2">Your Score</div>
                            <div className="text-6xl font-black text-purple-600 dark:text-purple-400 mb-4">{scoreData.score}%</div>
                            <div className="inline-flex items-center gap-1 bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-300 px-3 py-1 rounded-full text-sm font-bold">
                                +{scoreData.xp} XP Earned
                            </div>
                        </div>

                        <div className="flex flex-col gap-3">
                            <button
                                onClick={() => setView('list')}
                                className="w-full py-4 bg-gray-900 dark:bg-white dark:text-gray-900 text-white rounded-xl font-bold hover:bg-gray-800 dark:hover:bg-gray-100 transition shadow-lg"
                            >
                                Back to Achievements
                            </button>
                        </div>
                    </div>
                )}

            </main>
        </div>
    );
};

export default AchievementsPage;
