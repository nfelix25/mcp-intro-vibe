import { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
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

export function EditIssuePage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
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
  }, [id]);

  const loadData = async () => {
    try {
      const [issueRes, tagsRes, usersRes] = await Promise.all([
        issuesApi.get(id),
        tagsApi.list(),
        usersApi.list(),
      ]);
      
      const issue = issueRes.data;
      setFormData({
        title: issue.title,
        description: issue.description || '',
        status: issue.status,
        priority: issue.priority,
        assigned_user_id: issue.assigned_user_id || '',
        tag_ids: issue.tags.map(t => t.id),
      });
      setTags(tagsRes.data);
      setUsers(usersRes.data);
    } catch (error) {
      toast.error('Failed to load issue');
      navigate('/issues');
    } finally {
      setLoading(false);
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
    setSubmitting(true);

    try {
      const data = {
        ...formData,
        assigned_user_id: formData.assigned_user_id || null,
      };
      await issuesApi.update(id, data);
      toast.success('Issue updated successfully');
      navigate(`/issues/${id}`);
    } catch (error) {
      toast.error(error.response?.data?.error || 'Failed to update issue');
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div>Loading...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-3xl mx-auto py-8 px-4">
        <Link to={`/issues/${id}`}>
          <Button variant="ghost" className="mb-4">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Issue
          </Button>
        </Link>

        <Card>
          <CardHeader>
            <CardTitle>Edit Issue</CardTitle>
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
                <Button type="submit" disabled={submitting}>
                  {submitting ? 'Updating...' : 'Update Issue'}
                </Button>
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => navigate(`/issues/${id}`)}
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
