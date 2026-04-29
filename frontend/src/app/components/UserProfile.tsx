import React from 'react';
import { 
  User, 
  Mail, 
  BookOpen, 
  Settings, 
  LogOut, 
  History, 
  Award, 
  Cpu, 
  Activity, 
  CheckCircle2, 
  Camera,
  ChevronRight,
  ShieldCheck,
  Bell
} from 'lucide-react';
import { Button } from './ui/button';
import { Card, CardHeader, CardTitle, CardContent, CardDescription } from './ui/card';
import { Avatar, AvatarImage, AvatarFallback } from './ui/avatar';
import { Badge } from './ui/badge';
import { Tabs, TabsList, TabsTrigger, TabsContent } from './ui/tabs';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { ImageWithFallback } from './shared/ImageWithFallback';
import { useUser } from '../contexts/UserContext';

interface UserProfileProps {
  onLogout: () => void;
  onBack: () => void;
  initialTab?: string;
}

export function UserProfile({ onLogout, onBack, initialTab = 'profile' }: UserProfileProps) {
  const { userData, updateUserData } = useUser();
  const [isEditing, setIsEditing] = React.useState(false);
  const [activeTab, setActiveTab] = React.useState(initialTab);
  const [formData, setFormData] = React.useState({
    name: userData.name,
    email: userData.email,
    institution: userData.institution,
    rollNumber: userData.rollNumber,
  });
  const fileInputRef = React.useRef<HTMLInputElement>(null);

  const handleSave = () => {
    updateUserData(formData);
    setIsEditing(false);
  };

  const handleCancel = () => {
    setFormData({
      name: userData.name,
      email: userData.email,
      institution: userData.institution,
      rollNumber: userData.rollNumber,
    });
    setIsEditing(false);
  };

  const handleAvatarClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        const base64String = reader.result as string;
        updateUserData({ avatar: base64String });
      };
      reader.readAsDataURL(file);
    }
  };

  const profileCompletion = Math.min(
    100,
    Math.round(
      ((userData.name ? 25 : 0) +
        (userData.email ? 25 : 0) +
        (userData.institution ? 25 : 0) +
        (userData.rollNumber ? 25 : 0))
    )
  );

  const progressEntries = Object.values(userData.experimentsProgress || {});
  const completedExperiments = progressEntries.filter(progress => progress.isValidated).length;
  const unlockedAchievements = userData.achievements.filter(achievement => achievement.unlockedAtAt).length;
  const totalHours = progressEntries.reduce((sum, progress) => sum + (progress.timeSpent || 0), 0) / 3600;
  const recentActivities = progressEntries
    .sort((a, b) => new Date(b.lastModified).getTime() - new Date(a.lastModified).getTime())
    .slice(0, 5)
    .map(progress => ({
      title: progress.title || progress.id,
      date: new Date(progress.lastModified).toLocaleDateString(),
      status: progress.isValidated ? 'Validated' : 'In Progress',
    }));
  const forwardTotal = progressEntries.filter(progress => progress.id.startsWith('F')).length;
  const forwardCompleted = progressEntries.filter(progress => progress.id.startsWith('F') && progress.isValidated).length;
  const reverseTotal = progressEntries.filter(progress => progress.id.startsWith('R')).length;
  const reverseCompleted = progressEntries.filter(progress => progress.id.startsWith('R') && progress.isValidated).length;
  const forwardPercent = forwardTotal ? Math.round((forwardCompleted / forwardTotal) * 100) : 0;
  const reversePercent = reverseTotal ? Math.round((reverseCompleted / reverseTotal) * 100) : 0;

  const stats = [
    { icon: CheckCircle2, value: `${profileCompletion}%`, label: 'Profile', bg: 'bg-emerald-100', color: 'text-emerald-700' },
    { icon: Cpu, value: String(completedExperiments), label: 'Experiments', bg: 'bg-blue-100', color: 'text-blue-700' },
    { icon: Award, value: String(unlockedAchievements), label: 'Achievements', bg: 'bg-indigo-100', color: 'text-indigo-700' },
    { icon: History, value: `${totalHours.toFixed(1)}h`, label: 'Lab Time', bg: 'bg-slate-100', color: 'text-slate-600' },
  ];

  return (
    <div className="min-h-screen">
      <div className="max-w-5xl mx-auto">
        {/* Profile Header Card */}
        <div className="bg-white dark:bg-slate-800 rounded-[2rem] border border-slate-200 dark:border-slate-700 overflow-hidden shadow-sm mb-8">
          <div className="h-48 bg-gradient-to-r from-slate-700 via-slate-600 to-slate-700 dark:from-slate-800 dark:via-slate-700 dark:to-slate-800 relative">
            <div className="absolute inset-0 bg-gradient-to-br from-blue-600/10 to-indigo-600/10" />
            <button 
              onClick={onBack}
              className="absolute top-6 left-6 text-white/80 hover:text-white flex items-center gap-2 text-sm font-medium transition-colors"
            >
              <ChevronRight className="rotate-180 w-4 h-4" />
              Back to Dashboard
            </button>
          </div>
          
          <div className="px-8 pb-8 -mt-16 relative">
            {/* Hidden file input for avatar upload */}
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              onChange={handleFileChange}
              className="hidden"
            />
            
            <div className="flex flex-col md:flex-row items-end gap-6 md:gap-8">
              <div className="relative group">
                <div className="w-32 h-32 rounded-3xl border-4 border-white dark:border-slate-700 shadow-xl overflow-hidden bg-slate-100 dark:bg-slate-700 ring-4 ring-slate-100/20 dark:ring-slate-600/20">
                  <ImageWithFallback 
                    src={userData.avatar} 
                    alt={userData.name}
                    className="w-full h-full object-cover"
                  />
                </div>
                <button 
                  onClick={handleAvatarClick}
                  className="absolute bottom-2 right-2 bg-slate-900 dark:bg-slate-700 text-white p-2 rounded-xl shadow-lg hover:scale-105 transition-transform opacity-0 group-hover:opacity-100"
                >
                  <Camera size={16} />
                </button>
              </div>
              
              <div className="flex-1 pb-2">
                <div className="flex flex-wrap items-center gap-3 mb-2">
                  <h1 className="text-3xl font-bold text-slate-900 dark:text-white tracking-tight">{userData.name}</h1>
                  <Badge variant="secondary" className="bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-600 border-slate-200 dark:border-slate-600 px-3 py-1">
                    {userData.role}
                  </Badge>
                </div>
                <div className="flex flex-wrap items-center gap-4 text-slate-500 dark:text-slate-400 text-sm font-medium">
                  <div className="flex items-center gap-1.5">
                    <Mail size={16} className="text-slate-400 dark:text-slate-500" />
                    {userData.email}
                  </div>
                  <div className="flex items-center gap-1.5">
                    <BookOpen size={16} className="text-slate-400 dark:text-slate-500" />
                    {userData.institution}
                  </div>
                  <div className="flex items-center gap-1.5">
                    <ShieldCheck size={16} className="text-slate-400 dark:text-slate-500" />
                    ID: {userData.rollNumber}
                  </div>
                </div>
              </div>
              
              <div className="flex items-center gap-3 pb-2">
                <Button 
                  onClick={() => {
                    if (isEditing) {
                      handleCancel();
                    } else {
                      setIsEditing(true);
                    }
                  }} 
                  variant="outline"
                  className="border-slate-200 dark:border-slate-600 text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700"
                >
                  {isEditing ? 'Cancel Editing' : 'Edit Profile'}
                </Button>
                <Button 
                  variant="outline" 
                  className="text-red-600 border-red-200 dark:border-red-900 hover:bg-red-50 dark:hover:bg-red-950 hover:text-red-700 dark:hover:text-red-400"
                  onClick={onLogout}
                >
                  <LogOut size={16} className="mr-2" />
                  Logout
                </Button>
              </div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column - Navigation & Quick Stats */}
          <div className="space-y-6">
            <Card className="rounded-[2rem] border-slate-200 dark:border-slate-700 shadow-sm overflow-hidden">
              <CardContent className="p-2">
                <div className="space-y-1">
                  {[
                    { id: 'profile', label: 'Profile Overview', icon: User },
                    { id: 'progress', label: 'Academic Progress', icon: Activity },
                    { id: 'achievements', label: 'Achievements', icon: Award },
                    { id: 'settings', label: 'Account Settings', icon: Settings },
                    { id: 'notifications', label: 'Notifications', icon: Bell },
                  ].map((item) => (
                    <button
                      key={item.id}
                      onClick={() => setActiveTab(item.id)}
                      className={`w-full flex items-center gap-3 px-4 py-3.5 rounded-2xl text-sm font-semibold transition-all ${
                        activeTab === item.id 
                          ? 'bg-blue-600 text-white shadow-lg shadow-blue-200 dark:shadow-blue-900/30' 
                          : 'text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-700'
                      }`}
                    >
                      <item.icon size={18} />
                      {item.label}
                    </button>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Card className="rounded-[2rem] border-slate-200 dark:border-slate-700 shadow-sm overflow-hidden">
              <CardHeader className="pb-2">
                <CardTitle className="text-lg">Quick Stats</CardTitle>
              </CardHeader>
              <CardContent className="p-4 space-y-4">
                {stats.map((stat, i) => (
                  <div key={i} className="flex items-center gap-4 p-4 rounded-2xl bg-slate-50 dark:bg-slate-700/50 border border-slate-100 dark:border-slate-600">
                    <div className={`p-2.5 rounded-xl ${stat.bg} dark:bg-opacity-20`}>
                      <stat.icon className={`w-5 h-5 ${stat.color} dark:opacity-90`} />
                    </div>
                    <div>
                      <div className="text-2xl font-bold text-slate-900 dark:text-white">{stat.value}</div>
                      <div className="text-[10px] uppercase tracking-wider font-bold text-slate-400 dark:text-slate-500">{stat.label}</div>
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>
          </div>

          {/* Right Column - Content Areas */}
          <div className="lg:col-span-2 space-y-8">
            {activeTab === 'profile' && (
              <div className="space-y-8">
                {isEditing ? (
                  <Card className="rounded-[2rem] border-slate-200 dark:border-slate-700 shadow-sm overflow-hidden">
                    <CardHeader>
                      <CardTitle>Personal Information</CardTitle>
                      <CardDescription>Update your profile details and preferences.</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-6">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="space-y-2">
                          <Label htmlFor="fullName">Full Name</Label>
                          <Input 
                            id="fullName" 
                            value={formData.name} 
                            onChange={(e) => setFormData({...formData, name: e.target.value})}
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="email">Email Address</Label>
                          <Input 
                            id="email" 
                            value={formData.email} 
                            onChange={(e) => setFormData({...formData, email: e.target.value})}
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="id">Student ID</Label>
                          <Input id="id" value={formData.rollNumber} disabled />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="department">Department</Label>
                          <Input 
                            id="department" 
                            value={formData.institution}
                            onChange={(e) => setFormData({...formData, institution: e.target.value})}
                          />
                        </div>
                      </div>
                      <div className="flex justify-end gap-3 pt-4">
                        <Button variant="outline" onClick={handleCancel}>Cancel</Button>
                        <Button onClick={handleSave} className="bg-blue-600 hover:bg-blue-700 text-white">Save Changes</Button>
                      </div>
                    </CardContent>
                  </Card>
                ) : (
                  <>
                    <Card className="rounded-[2rem] border-slate-200 dark:border-slate-700 shadow-sm overflow-hidden">
                      <CardHeader className="flex flex-row items-center justify-between">
                        <div>
                          <CardTitle>Recent Activity</CardTitle>
                          <CardDescription>Track your latest lab experiments and results.</CardDescription>
                        </div>
                        <Button variant="ghost" size="sm" className="text-blue-600 dark:text-blue-400">View All</Button>
                      </CardHeader>
                      <CardContent className="px-0">
                        <div className="divide-y divide-slate-100 dark:divide-slate-700">
                          {recentActivities.length === 0 ? (
                            <div className="px-6 py-10 text-center">
                              <p className="text-sm font-bold text-slate-500 dark:text-slate-400">No activity yet</p>
                              <p className="text-xs text-slate-400 dark:text-slate-500 mt-1">Saved experiments will appear here.</p>
                            </div>
                          ) : recentActivities.map((activity, i) => (
                            <div key={i} className="px-6 py-4 flex items-center justify-between hover:bg-slate-50 dark:hover:bg-slate-700/50 transition-colors">
                              <div className="flex items-center gap-4">
                                <div className="p-2 bg-slate-100 dark:bg-slate-700 rounded-lg">
                                  <Activity size={18} className="text-slate-600 dark:text-slate-400" />
                                </div>
                                <div>
                                  <div className="text-sm font-semibold text-slate-900 dark:text-white">{activity.title}</div>
                                  <div className="text-xs text-slate-500 dark:text-slate-400">{activity.date}</div>
                                </div>
                              </div>
                              <Badge variant={activity.status === 'Validated' ? 'default' : 'secondary'} 
                                     className={activity.status === 'Validated' ? 'bg-emerald-100 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-400 hover:bg-emerald-200 dark:hover:bg-emerald-900/50' : 'bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-300'}>
                                {activity.status}
                              </Badge>
                            </div>
                          ))}
                        </div>
                      </CardContent>
                    </Card>

                    <Card className="rounded-[2rem] border-slate-200 dark:border-slate-700 shadow-sm overflow-hidden">
                      <CardHeader>
                        <CardTitle>Learning Tracks</CardTitle>
                        <CardDescription>Your progress across the two main experimentation tracks.</CardDescription>
                      </CardHeader>
                      <CardContent className="space-y-6">
                        <div className="p-6 bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20 rounded-3xl border border-blue-100 dark:border-blue-800">
                          <div className="flex justify-between items-center mb-4">
                            <div className="flex items-center gap-3">
                              <div className="p-2 bg-white dark:bg-slate-800 rounded-xl shadow-sm">
                                <Activity className="text-blue-600 dark:text-blue-400" />
                              </div>
                              <span className="font-bold text-slate-900 dark:text-white">Forward Experiments (8086)</span>
                            </div>
                            <span className="text-sm font-bold text-blue-700 dark:text-blue-400">{forwardCompleted}/{Math.max(forwardTotal, 4)} Complete</span>
                          </div>
                          <div className="h-2 bg-white/50 dark:bg-slate-700/50 rounded-full overflow-hidden mb-2">
                            <div className="h-full bg-blue-600 dark:bg-blue-500" style={{ width: `${forwardPercent}%` }} />
                          </div>
                          <p className="text-xs text-slate-500 dark:text-slate-400 font-medium">{forwardCompleted === 0 ? 'No forward experiments completed yet' : 'Forward track progress is based on your saved validations'}</p>
                        </div>

                        <div className="p-6 bg-gradient-to-br from-indigo-50 to-purple-50 dark:from-indigo-900/20 dark:to-purple-900/20 rounded-3xl border border-indigo-100 dark:border-indigo-800">
                          <div className="flex justify-between items-center mb-4">
                            <div className="flex items-center gap-3">
                              <div className="p-2 bg-white dark:bg-slate-800 rounded-xl shadow-sm">
                                <History className="text-indigo-600 dark:text-indigo-400" />
                              </div>
                              <span className="font-bold text-slate-900 dark:text-white">Reverse Experiments (8051)</span>
                            </div>
                            <span className="text-sm font-bold text-indigo-700 dark:text-indigo-400">{reverseCompleted}/{Math.max(reverseTotal, 4)} Complete</span>
                          </div>
                          <div className="h-2 bg-white/50 dark:bg-slate-700/50 rounded-full overflow-hidden mb-2">
                            <div className="h-full bg-indigo-600 dark:bg-indigo-500" style={{ width: `${reversePercent}%` }} />
                          </div>
                          <p className="text-xs text-slate-500 dark:text-slate-400 font-medium">{reverseCompleted === 0 ? 'No reverse experiments completed yet' : 'Reverse track progress is based on your saved validations'}</p>
                        </div>
                      </CardContent>
                    </Card>
                  </>
                )}
              </div>
            )}

            {activeTab === 'settings' && (
              <Card className="rounded-[2rem] border-slate-200 dark:border-slate-700 shadow-sm overflow-hidden">
                <CardHeader>
                  <CardTitle>Security & Access</CardTitle>
                  <CardDescription>Manage your password and security settings.</CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="space-y-4">
                    <div className="p-4 rounded-2xl border border-slate-100 dark:border-slate-700 bg-slate-50 dark:bg-slate-700/50 flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <ShieldCheck className="text-slate-400 dark:text-slate-500" />
                        <div>
                          <div className="text-sm font-semibold dark:text-white">Two-Factor Authentication</div>
                          <div className="text-xs text-slate-500 dark:text-slate-400">Currently disabled</div>
                        </div>
                      </div>
                      <Button variant="outline" size="sm">Enable</Button>
                    </div>
                    <div className="p-4 rounded-2xl border border-slate-100 dark:border-slate-700 bg-slate-50 dark:bg-slate-700/50 flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <Settings className="text-slate-400 dark:text-slate-500" />
                        <div>
                          <div className="text-sm font-semibold dark:text-white">Password</div>
                          <div className="text-xs text-slate-500 dark:text-slate-400">Last changed 3 months ago</div>
                        </div>
                      </div>
                      <Button variant="outline" size="sm">Update</Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}

            {(activeTab === 'notifications' || activeTab === 'progress') && (
              <div className="flex flex-col items-center justify-center py-24 text-center space-y-4 bg-white dark:bg-slate-800 rounded-[2rem] border border-slate-200 dark:border-slate-700 border-dashed">
                <div className="p-4 bg-slate-50 dark:bg-slate-700 rounded-full text-slate-400 dark:text-slate-500">
                  <Activity size={32} />
                </div>
                <div>
                  <h3 className="text-lg font-bold text-slate-900 dark:text-white">Module Coming Soon</h3>
                  <p className="text-slate-500 dark:text-slate-400 max-w-xs mx-auto">We're finalizing the detailed {activeTab} analytics for your experimental track.</p>
                </div>
              </div>
            )}

            {activeTab === 'achievements' && (
              <Card className="rounded-[2rem] border-slate-200 dark:border-slate-700 shadow-sm overflow-hidden">
                <CardHeader>
                  <CardTitle>Your Achievements</CardTitle>
                  <CardDescription>Unlock badges and rewards as you complete experiments.</CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {userData.achievements.map((achievement, i) => (

                      <div 
                        key={i} 
                        className={`p-6 rounded-2xl border transition-all ${
                          achievement.unlockedAt 
                            ? 'bg-gradient-to-br ' + 'from-blue-500 to-cyan-500' + ' border-transparent text-white shadow-lg' 
                            : 'bg-slate-50 dark:bg-slate-700/50 border-slate-200 dark:border-slate-600 opacity-60'
                        }`}
                      >
                        <div className="flex items-start gap-4">
                          <div className={`text-4xl ${achievement.unlockedAt ? 'scale-110' : 'grayscale'}`}>
                            {achievement.icon}
                          </div>
                          <div className="flex-1">
                            <div className={`font-bold mb-1 ${achievement.unlockedAt ? 'text-white' : 'text-slate-900 dark:text-white'}`}>
                              {achievement.title}
                            </div>
                            <div className={`text-sm ${achievement.unlockedAt ? 'text-white/90' : 'text-slate-500 dark:text-slate-400'}`}>
                              {achievement.description}
                            </div>
                            {achievement.unlockedAt && (
                              <Badge className="mt-2 bg-white/20 hover:bg-white/30 text-white border-white/40">
                                Unlocked
                              </Badge>
                            )}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

