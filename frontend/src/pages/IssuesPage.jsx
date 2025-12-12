import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { issuesApi, tagsApi, usersApi } from '../lib/api';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Select } from '../components/ui/select';
import { Card, CardContent } from '../components/ui/card';
import { StatusBadge } from '../components/StatusBadge';
import { TagBadge } from '../components/TagBadge';
import { UserAvatar } from '../components/UserAvatar';
import { Plus, Search } from 'lucide-react';
import { toast } from 'sonner';

export function IssuesPage() {
  const [issues, setIssues] = useState([]);
  const [tags, setTags] = useState([]);
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({
    status: '',
    assigned_user_id: '',
    tag_ids: '',
    search: '',
  });
  const navigate = useNavigate();

  useEffect(() => {
    loadData();
  }, [filters]);

  const loadData = async () => {
    setLoading(true);
    try {
      const [issuesRes, tagsRes, usersRes] = await Promise.all([
        issuesApi.list(filters),
        tagsApi.list(),
        usersApi.list(),
      ]);
      setIssues(issuesRes.data.issues);
      setTags(tagsRes.data);
      setUsers(usersRes.data);
    } catch (error) {
      toast.error('Failed to load issues');
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const handleFilterChange = (key, value) => {
    setFilters(prev => ({ ...prev, [key]: value }));
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto py-8 px-4">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold">Issues</h1>
          <Button onClick={() => navigate('/issues/new')}>
            <Plus className="h-4 w-4 mr-2" />
            New Issue
          </Button>
        </div>

        {/* Filters */}
        <Card className="mb-6">
          <CardContent className="pt-6">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div>
                <Input
                  placeholder="Search issues..."
                  value={filters.search}
                  onChange={(e) => handleFilterChange('search', e.target.value)}
                  className="w-full"
                />
              </div>
              <Select
                value={filters.status}
                onChange={(e) => handleFilterChange('status', e.target.value)}
              >
                <option value="">All Statuses</option>
                <option value="not_started">Not Started</option>
                <option value="in_progress">In Progress</option>
                <option value="done">Done</option>
              </Select>
              <Select
                value={filters.assigned_user_id}
                onChange={(e) => handleFilterChange('assigned_user_id', e.target.value)}
              >
                <option value="">All Assignees</option>
                {users.map(user => (
                  <option key={user.id} value={user.id}>
                    {user.name}
                  </option>
                ))}
              </Select>
              <Select
                value={filters.tag_ids}
                onChange={(e) => handleFilterChange('tag_ids', e.target.value)}
              >
                <option value="">All Tags</option>
                {tags.map(tag => (
                  <option key={tag.id} value={tag.id}>
                    {tag.name}
                  </option>
                ))}
              </Select>
            </div>
          </CardContent>
        </Card>

        {/* Issues List */}
        {loading ? (
          <div className="text-center py-12">Loading...</div>
        ) : issues.length === 0 ? (
          <Card>
            <CardContent className="py-12 text-center">
              <p className="text-muted-foreground mb-4">No issues found</p>
              <Button onClick={() => navigate('/issues/new')}>Create your first issue</Button>
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-4">
            {issues.map(issue => (
              <Card
                key={issue.id}
                className="hover:shadow-md transition-shadow cursor-pointer"
                onClick={() => navigate(`/issues/${issue.id}`)}
              >
                <CardContent className="p-6">
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-3 mb-2">
                        <h3 className="text-lg font-semibold truncate">{issue.title}</h3>
                        <StatusBadge status={issue.status} />
                      </div>
                      {issue.description && (
                        <p className="text-sm text-muted-foreground line-clamp-2 mb-3">
                          {issue.description}
                        </p>
                      )}
                      <div className="flex items-center gap-4 text-sm text-muted-foreground">
                        <span>#{issue.id}</span>
                        {issue.assigned_user && (
                          <div className="flex items-center gap-2">
                            <UserAvatar user={issue.assigned_user} size="sm" />
                            <span>{issue.assigned_user.name}</span>
                          </div>
                        )}
                        <span>{new Date(issue.created_at).toLocaleDateString()}</span>
                      </div>
                    </div>
                    {issue.tags.length > 0 && (
                      <div className="flex flex-wrap gap-2">
                        {issue.tags.map(tag => (
                          <TagBadge key={tag.id} tag={tag} />
                        ))}
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
