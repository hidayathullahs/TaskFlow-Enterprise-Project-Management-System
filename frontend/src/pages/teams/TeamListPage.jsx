import React, { useEffect, useState } from 'react';
import { Users, Plus, Shield, Trash2 } from 'lucide-react';
import { toast } from 'react-hot-toast';
import { teamService } from '../../services/teamService';
import { Card } from '../../components/common/Card';
import { Button } from '../../components/common/Button';
import { Skeleton } from '../../components/common/Skeleton';

export const TeamListPage = () => {
  const [teams, setTeams] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchTeams = async () => {
    try {
      const res = await teamService.getAll();
      setTeams(res.data || []);
    } catch (err) {
      toast.error('Failed to load teams');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTeams();
  }, []);

  const handleDelete = async (publicId) => {
    if (window.confirm('Delete this team?')) {
      try {
        await teamService.delete(publicId);
        toast.success('Team deleted');
        fetchTeams();
      } catch (err) {
        toast.error('Failed to delete team');
      }
    }
  };

  if (loading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {[...Array(6)].map((_, i) => (
          <Skeleton key={i} className="h-44 w-full" />
        ))}
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-black text-slate-900 dark:text-slate-100">
            Teams & Agile Squads Directory
          </h1>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            Manage functional teams, agile project squads, and team leads.
          </p>
        </div>
        <Button size="sm">
          <Plus className="w-4 h-4 mr-2" /> Create Agile Team
        </Button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {teams.map((team) => (
          <Card key={team.publicId} className="hover:shadow-md transition-all">
            <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-700/60 pb-3 mb-3">
              <div className="flex items-center gap-3">
                <div className="p-2.5 rounded-xl bg-purple-50 dark:bg-purple-950/50 text-purple-600">
                  <Users className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-base font-bold text-slate-900 dark:text-slate-100">{team.name}</h3>
                  <span className="text-xs font-semibold text-purple-600">{team.departmentName || 'General'}</span>
                </div>
              </div>
              <button onClick={() => handleDelete(team.publicId)} className="text-slate-400 hover:text-rose-600">
                <Trash2 className="w-4 h-4" />
              </button>
            </div>

            <p className="text-xs text-slate-500 dark:text-slate-400 mb-4">
              {team.description || 'Dedicated agile team.'}
            </p>

            <div className="flex items-center justify-between text-xs pt-2 border-t border-slate-100 dark:border-slate-700/60">
              <span className="text-slate-400">Lead: <b>{team.teamLeadName}</b></span>
              <span className="font-bold text-slate-800 dark:text-slate-200">{team.memberCount} Members</span>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
};
