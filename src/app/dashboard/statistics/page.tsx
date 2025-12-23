"use client"
 import { useState } from 'react';
 import { TrendingUp, Trophy, Target, Activity, Users, Calendar } from 'lucide-react';
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend
} from 'recharts';

 

// Mock data para demonstração
const teamStats = {
  totalMatches: 15,
  wins: 8,
  draws: 4,
  losses: 3,
  goalsScored: 32,
  goalsConceded: 18,
  winRate: 53.3,
  currentStreak: 'V-V-E-D-V'
};

const performanceData = [
  { date: '10/11', result: 'V', goalsScored: 3, goalsConceded: 1 },
  { date: '17/11', result: 'D', goalsScored: 1, goalsConceded: 3 },
  { date: '24/11', result: 'E', goalsScored: 2, goalsConceded: 2 },
  { date: '01/12', result: 'V', goalsScored: 3, goalsConceded: 1 },
  { date: '08/12', result: 'V', goalsScored: 2, goalsConceded: 0 },
  { date: '15/12', result: 'E', goalsScored: 1, goalsConceded: 1 }
];

const topScorers = [
  { id: '1', name: 'João', goals: 8, assists: 3, matches: 12 },
  { id: '2', name: 'Pedrinho', goals: 6, assists: 5, matches: 14 },
  { id: '3', name: 'Felipe', goals: 5, assists: 2, matches: 11 },
  { id: '4', name: 'Carlos', goals: 4, assists: 6, matches: 13 },
  { id: '5', name: 'Gabriel', goals: 3, assists: 4, matches: 10 }
];

const minutesData = [
  { name: 'João', minutes: 1080 },
  { name: 'Pedrinho', minutes: 1260 },
  { name: 'Carlos', minutes: 1170 },
  { name: 'Rafael', minutes: 1200 },
  { name: 'Lucas', minutes: 950 },
  { name: 'Marquinhos', minutes: 900 }
];

const disciplineStats = [
  { name: 'Pedrinho', yellow: 5, red: 1 },
  { name: 'Bruno', yellow: 6, red: 1 },
  { name: 'Rafael', yellow: 4, red: 0 },
  { name: 'João', yellow: 3, red: 0 },
  { name: 'Gabriel', yellow: 3, red: 0 }
];

export default function StatisticsPage() {
  const [selectedTab, setSelectedTab] = useState<'geral' | 'jogadores' | 'disciplina'>('geral');

  const teamName = 'Garra FC';

  return (
    <div className="min-h-screen bg-slate-50 pb-20">
      {/* Header */}
      <header className="bg-slate-900 text-white px-4 py-6 shadow-lg">
        <div className="max-w-4xl mx-auto">
          <div className="text-sm text-slate-300 mb-1">MeuTime FC</div>
          <h1>Estatísticas do {teamName}</h1>
          <div className="text-sm text-slate-400 mt-2">
            Temporada 2024 • {teamStats.totalMatches} Jogos
          </div>
        </div>
      </header>

      {/* Tabs */}
      <div className="bg-white border-b border-slate-200 sticky top-0 z-10">
        <div className="max-w-4xl mx-auto flex">
          <button
            onClick={() => setSelectedTab('geral')}
            className={`flex-1 py-4 text-center transition-colors ${
              selectedTab === 'geral'
                ? 'text-emerald-600 border-b-2 border-emerald-600'
                : 'text-slate-600'
            }`}
          >
            GERAL
          </button>
          <button
            onClick={() => setSelectedTab('jogadores')}
            className={`flex-1 py-4 text-center transition-colors ${
              selectedTab === 'jogadores'
                ? 'text-emerald-600 border-b-2 border-emerald-600'
                : 'text-slate-600'
            }`}
          >
            JOGADORES
          </button>
          <button
            onClick={() => setSelectedTab('disciplina')}
            className={`flex-1 py-4 text-center transition-colors ${
              selectedTab === 'disciplina'
                ? 'text-emerald-600 border-b-2 border-emerald-600'
                : 'text-slate-600'
            }`}
          >
            DISCIPLINA
          </button>
        </div>
      </div>

      {/* Content */}
      <main className="max-w-4xl mx-auto px-4 py-6">
        {selectedTab === 'geral' && (
          <div className="space-y-6">
            {/* Summary Cards */}
            <div className="grid grid-cols-2 gap-4">
              {/* Win Rate */}
              <div className="bg-gradient-to-br from-emerald-500 to-emerald-600 rounded-lg p-5 text-white shadow-md">
                <div className="flex items-center gap-2 mb-2">
                  <Trophy className="w-5 h-5" />
                  <span className="text-sm opacity-90">Aproveitamento</span>
                </div>
                <div className="text-3xl mb-1">{teamStats.winRate}%</div>
                <div className="text-xs opacity-90">{teamStats.wins} vitórias</div>
              </div>

              {/* Goals */}
              <div className="bg-gradient-to-br from-yellow-400 to-yellow-500 rounded-lg p-5 text-slate-900 shadow-md">
                <div className="flex items-center gap-2 mb-2">
                  <Target className="w-5 h-5" />
                  <span className="text-sm opacity-90">Saldo de Gols</span>
                </div>
                <div className="text-3xl mb-1">+{teamStats.goalsScored - teamStats.goalsConceded}</div>
                <div className="text-xs opacity-90">{teamStats.goalsScored} marcados / {teamStats.goalsConceded} sofridos</div>
              </div>

              {/* Wins */}
              <div className="bg-white rounded-lg p-5 border border-slate-200 shadow-sm">
                <div className="flex items-center gap-2 mb-2 text-slate-600">
                  <TrendingUp className="w-5 h-5" />
                  <span className="text-sm">Vitórias</span>
                </div>
                <div className="text-3xl text-slate-900 mb-1">{teamStats.wins}</div>
                <div className="text-xs text-slate-500">{teamStats.draws} empates / {teamStats.losses} derrotas</div>
              </div>

              {/* Matches */}
              <div className="bg-white rounded-lg p-5 border border-slate-200 shadow-sm">
                <div className="flex items-center gap-2 mb-2 text-slate-600">
                  <Calendar className="w-5 h-5" />
                  <span className="text-sm">Total de Jogos</span>
                </div>
                <div className="text-3xl text-slate-900 mb-1">{teamStats.totalMatches}</div>
                <div className="text-xs text-slate-500">Temporada 2024</div>
              </div>
            </div>

            {/* Current Streak */}
            <div className="bg-white rounded-lg p-5 border border-slate-200 shadow-sm">
              <h3 className="text-slate-900 mb-4">Últimos 5 Resultados</h3>
              <div className="flex items-center justify-center gap-3">
                {teamStats.currentStreak.split('-').map((result, index) => (
                  <div
                    key={index}
                    className={`w-12 h-12 rounded-full flex items-center justify-center shadow-sm ${
                      result === 'V'
                        ? 'bg-emerald-500 text-white'
                        : result === 'E'
                        ? 'bg-yellow-400 text-slate-900'
                        : 'bg-red-500 text-white'
                    }`}
                  >
                    {result}
                  </div>
                ))}
              </div>
              <div className="text-center text-sm text-slate-500 mt-3">
                V = Vitória | E = Empate | D = Derrota
              </div>
            </div>

            {/* Performance Chart */}
            <div className="bg-white rounded-lg p-5 border border-slate-200 shadow-sm">
              <h3 className="text-slate-900 mb-4">Desempenho ao Longo do Tempo</h3>
              <div className="h-64">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={performanceData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                    <XAxis 
                      dataKey="date" 
                      tick={{ fill: '#64748b', fontSize: 12 }}
                      stroke="#cbd5e1"
                    />
                    <YAxis 
                      tick={{ fill: '#64748b', fontSize: 12 }}
                      stroke="#cbd5e1"
                    />
                    <Tooltip 
                      contentStyle={{ 
                        backgroundColor: '#fff', 
                        border: '1px solid #e2e8f0',
                        borderRadius: '8px',
                        boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)'
                      }}
                    />
                    <Legend />
                    <Line 
                      type="monotone" 
                      dataKey="goalsScored" 
                      stroke="#10b981" 
                      strokeWidth={2}
                      name="Gols Marcados"
                      dot={{ fill: '#10b981', r: 4 }}
                    />
                    <Line 
                      type="monotone" 
                      dataKey="goalsConceded" 
                      stroke="#ef4444" 
                      strokeWidth={2}
                      name="Gols Sofridos"
                      dot={{ fill: '#ef4444', r: 4 }}
                    />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </div>
          </div>
        )}

        {selectedTab === 'jogadores' && (
          <div className="space-y-6">
            {/* Top Scorers */}
            <div className="bg-white rounded-lg border border-slate-200 shadow-sm">
              <div className="p-5 border-b border-slate-200">
                <h3 className="text-slate-900 flex items-center gap-2">
                  <Trophy className="w-5 h-5 text-yellow-500" />
                  Artilharia
                </h3>
              </div>
              <div className="divide-y divide-slate-200">
                {topScorers.map((player, index) => (
                  <div key={player.id} className="p-4 flex items-center gap-4 hover:bg-slate-50 transition-colors">
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 ${
                      index === 0 ? 'bg-yellow-400 text-slate-900' :
                      index === 1 ? 'bg-slate-300 text-slate-900' :
                      index === 2 ? 'bg-orange-400 text-white' :
                      'bg-slate-100 text-slate-600'
                    }`}>
                      {index + 1}º
                    </div>
                    <div className="flex-1">
                      <h4 className="text-slate-900">{player.name}</h4>
                      <p className="text-sm text-slate-500">{player.matches} jogos</p>
                    </div>
                    <div className="text-right">
                      <div className="text-slate-900">{player.goals} gols</div>
                      <div className="text-sm text-slate-500">{player.assists} assist.</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Assists Leaders */}
            <div className="bg-white rounded-lg border border-slate-200 shadow-sm">
              <div className="p-5 border-b border-slate-200">
                <h3 className="text-slate-900 flex items-center gap-2">
                  <Activity className="w-5 h-5 text-emerald-500" />
                  Assistências
                </h3>
              </div>
              <div className="divide-y divide-slate-200">
                {[...topScorers].sort((a, b) => b.assists - a.assists).slice(0, 5).map((player, index) => (
                  <div key={player.id} className="p-4 flex items-center gap-4 hover:bg-slate-50 transition-colors">
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 ${
                      index === 0 ? 'bg-emerald-500 text-white' :
                      'bg-slate-100 text-slate-600'
                    }`}>
                      {index + 1}º
                    </div>
                    <div className="flex-1">
                      <h4 className="text-slate-900">{player.name}</h4>
                      <p className="text-sm text-slate-500">{player.matches} jogos</p>
                    </div>
                    <div className="text-right">
                      <div className="text-slate-900">{player.assists} assist.</div>
                      <div className="text-sm text-slate-500">{player.goals} gols</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Minutes Played Chart */}
            <div className="bg-white rounded-lg p-5 border border-slate-200 shadow-sm">
              <h3 className="text-slate-900 mb-4 flex items-center gap-2">
                <Users className="w-5 h-5 text-slate-600" />
                Minutos Jogados
              </h3>
              <div className="h-64">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={minutesData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                    <XAxis 
                      dataKey="name" 
                      tick={{ fill: '#64748b', fontSize: 12 }}
                      stroke="#cbd5e1"
                    />
                    <YAxis 
                      tick={{ fill: '#64748b', fontSize: 12 }}
                      stroke="#cbd5e1"
                    />
                    <Tooltip 
                      contentStyle={{ 
                        backgroundColor: '#fff', 
                        border: '1px solid #e2e8f0',
                        borderRadius: '8px',
                        boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)'
                      }}
                      formatter={(value) => [`${value} min`, 'Minutos']}
                    />
                    <Bar 
                      dataKey="minutes" 
                      fill="#10b981" 
                      radius={[8, 8, 0, 0]}
                    />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>
          </div>
        )}

        {selectedTab === 'disciplina' && (
          <div className="space-y-6">
            {/* Discipline Overview */}
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-yellow-400 rounded-lg p-5 text-slate-900 shadow-md">
                <div className="flex items-center gap-2 mb-2">
                  <div className="w-4 h-5 bg-slate-900 rounded-sm opacity-90"></div>
                  <span className="text-sm opacity-90">Cartões Amarelos</span>
                </div>
                <div className="text-3xl">23</div>
              </div>

              <div className="bg-red-600 rounded-lg p-5 text-white shadow-md">
                <div className="flex items-center gap-2 mb-2">
                  <div className="w-4 h-5 bg-white rounded-sm opacity-90"></div>
                  <span className="text-sm opacity-90">Cartões Vermelhos</span>
                </div>
                <div className="text-3xl">2</div>
              </div>
            </div>

            {/* Discipline Table */}
            <div className="bg-white rounded-lg border border-slate-200 shadow-sm">
              <div className="p-5 border-b border-slate-200">
                <h3 className="text-slate-900">Ranking de Cartões</h3>
              </div>
              <div className="divide-y divide-slate-200">
                {disciplineStats.map((player, index) => (
                  <div key={index} className="p-4 flex items-center gap-4">
                    <div className="w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center flex-shrink-0 text-slate-600">
                      {index + 1}º
                    </div>
                    <div className="flex-1">
                      <h4 className="text-slate-900">{player.name}</h4>
                    </div>
                    <div className="flex items-center gap-4">
                      {player.yellow > 0 && (
                        <div className="flex items-center gap-2">
                          <div className="w-3 h-4 bg-yellow-400 rounded-sm"></div>
                          <span className="text-slate-900">{player.yellow}</span>
                        </div>
                      )}
                      {player.red > 0 && (
                        <div className="flex items-center gap-2">
                          <div className="w-3 h-4 bg-red-600 rounded-sm"></div>
                          <span className="text-slate-900">{player.red}</span>
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Fair Play Message */}
            <div className="bg-emerald-50 border border-emerald-200 rounded-lg p-5">
              <div className="flex items-start gap-3">
                <div className="w-10 h-10 rounded-full bg-emerald-500 flex items-center justify-center flex-shrink-0">
                  <Trophy className="w-5 h-5 text-white" />
                </div>
                <div>
                  <h4 className="text-emerald-900 mb-1">Fair Play</h4>
                  <p className="text-sm text-emerald-700">
                    Continue jogando limpo! Uma boa disciplina contribui para o desempenho do time e a imagem do clube.
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}
      </main>

      
    </div>
  );
}