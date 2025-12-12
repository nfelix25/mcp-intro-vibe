import { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { issuesApi, tagsApi, usersApi } from '../lib/api';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Label } from '../components/ui/label';
import { Select } from '../components/ui/select';
import { Textarea } from '../components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { TagBadge } from '../components/TagBadge';
import { ArrowLeft } from 'lucide-react';
import { toast } from 'sonner';

export function CreateIssuePage() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [tags, setTags] = useState([]);
  const [users, setUsers] = useState([]);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    status: 'not_started',
    priority: 'medium',
    assigned_user_id: '',
    tag_ids: [],
  });

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      const [tagsRes, usersRes] = await Promise.all([
        tagsApi.list(),
        usersApi.list(),
      ]);
      setTags(tagsRes.data);
      setUsers(usersRes.data);
    } catch (error) {
      toast.error('Failed to load data');
    }
  };

  const handleChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleTagToggle = (tagId) => {
    setFormData(prev => ({
      ...prev,
      tag_ids: prev.tag_ids.includes(tagId)
        ? prev.tag_ids.filter(id => id !== tagId)
        : [...prev.tag_ids, tagId],
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const data = {
        ...formData,
        assigned_user_id: formData.assigned_user_id || null,
      };
      const response = await issuesApi.create(data);
      toast.success('Issue created successfully');
      navigate(`/issues/${response.data.id}`);
    } catch (error) {
      toast.error(error.response?.data?.error || 'Failed to create issue');
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-3xl mx-auto py-8 px-4">
        <Link to="/issues">
          <Button variant="ghost" className="mb-4">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Issues
          </Button>
        </Link>

        <Card>
          <CardHeader>
            <CardTitle>Create New Issue</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="title">Title *</Label>
                <Input
                  id="title"
                  value={formData.title}
                  onChange={(e) => handleChange('title', e.target.value)}
                  placeholder="Enter issue title"
                  required
                  maxLength={200}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="description">Description</Label>
                <Textarea
                  id="description"
                  value={formData.description}
                  onChange={(e) => handleChange('description', e.target.value)}
                  placeholder="Describe the issue in detail"
                  rows={6}
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="status">Status</Label>
                  <Select
                    id="status"
                    value={formData.status}
                    onChange={(e) => handleChange('status', e.target.value)}
                  >
                    <option value="not_started">Not Started</option>
                    <option value="in_progress">In Progress</option>
                    <option value="done">Done</option>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="priority">Priority</Label>
                  <Select
                    id="priority"
                    value={formData.priority}
                    onChange={(e) => handleChange('priority', e.target.value)}
                  >
                    <option value="low">Low</option>
                    <option value="medium">Medium</option>
                    <option value="high">High</option>
                  </Select>
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="assigned_user_id">Assignee</Label>
                <Select
                  id="assigned_user_id"
                  value={formData.assigned_user_id}
                  onChange={(e) => handleChange('assigned_user_id', e.target.value)}
                >
                  <option value="">Unassigned</option>
                  {users.map(user => (
                    <option key={user.id} value={user.id}>
                      {user.name}
                    </option>
                  ))}
                </Select>
              </div>

              <div className="space-y-2">
                <Label>Tags</Label>
                <div className="flex flex-wrap gap-2 p-4 border rounded-md">
                  {tags.map(tag => (
                    <button
                      key={tag.id}
                      type="button"
                      onClick={() => handleTagToggle(tag.id)}
                      className={`cursor-pointer transition-opacity ${
                        formData.tag_ids.includes(tag.id) ? 'opacity-100' : 'opacity-50'
                      }`}
                    >
                      <TagBadge tag={tag} />
                    </button>
                  ))}
                </div>
              </div>

              <div className="flex gap-3">
                <Button type="submit" disabled={loading}>
                  {loading ? 'Creating...' : 'Create Issue'}
                </Button>
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => navigate('/issues')}
                >
                  Cancel
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
