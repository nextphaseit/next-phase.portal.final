'use client';

import { useState, useEffect } from 'react';
import { Calendar, Clock, MapPin, Users, Plus, Edit2, Trash2 } from 'lucide-react';
import { supabase } from '@/lib/supabaseClient';
import { toast } from 'react-hot-toast';

// Types
interface Event {
  id: string;
  title: string;
  description: string;
  date: string;
  time: string;
  location: string;
  attendees: number;
  created_at: string;
}

export default function EventsPage() {
  const [events, setEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedEvent, setSelectedEvent] = useState<Event | null>(null);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    date: '',
    time: '',
    location: '',
    attendees: 0,
  });

  // Fetch events from Supabase
  useEffect(() => {
    const fetchEvents = async () => {
      try {
        setLoading(true);
        setError(null);

        const { data, error: supabaseError } = await supabase
          .from('events')
          .select('*')
          .order('date', { ascending: true });

        if (supabaseError) throw supabaseError;

        setEvents(data || []);
      } catch (err) {
        console.error('Error fetching events:', err);
        setError('Failed to load events. Please try again later.');
        toast.error('Failed to load events');
      } finally {
        setLoading(false);
      }
    };

    fetchEvents();
  }, []);

  // Handle event creation
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const { data, error: supabaseError } = await supabase
        .from('events')
        .insert([formData])
        .select()
        .single();

      if (supabaseError) throw supabaseError;

      setEvents(prev => [data, ...prev]);
      setIsModalOpen(false);
      setFormData({
        title: '',
        description: '',
        date: '',
        time: '',
        location: '',
        attendees: 0,
      });
      toast.success('Event created successfully');
    } catch (err) {
      console.error('Error creating event:', err);
      toast.error('Failed to create event');
    }
  };

  // Handle event update
  const handleUpdate = async (event: Event) => {
    try {
      const { error: supabaseError } = await supabase
        .from('events')
        .update({
          title: event.title,
          description: event.description,
          date: event.date,
          time: event.time,
          location: event.location,
          attendees: event.attendees,
        })
        .eq('id', event.id);

      if (supabaseError) throw supabaseError;

      setEvents(prev => prev.map(e => e.id === event.id ? event : e));
      setIsModalOpen(false);
      setSelectedEvent(null);
      toast.success('Event updated successfully');
    } catch (err) {
      console.error('Error updating event:', err);
      toast.error('Failed to update event');
    }
  };

  // Handle event deletion
  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this event?')) return;

    try {
      const { error: supabaseError } = await supabase
        .from('events')
        .delete()
        .eq('id', id);

      if (supabaseError) throw supabaseError;

      setEvents(prev => prev.filter(event => event.id !== id));
      toast.success('Event deleted successfully');
    } catch (err) {
      console.error('Error deleting event:', err);
      toast.error('Failed to delete event');
    }
  };

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-red-600 mb-4">Error</h2>
          <p className="text-gray-600">{error}</p>
          <button
            onClick={() => window.location.reload()}
            className="mt-4 px-4 py-2 bg-[#006699] text-white rounded-lg hover:bg-[#005588]"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-[#333333]">Events</h1>
        <button
          onClick={() => {
            setSelectedEvent(null);
            setFormData({
              title: '',
              description: '',
              date: '',
              time: '',
              location: '',
              attendees: 0,
            });
            setIsModalOpen(true);
          }}
          className="flex items-center px-4 py-2 bg-[#006699] text-white rounded-lg hover:bg-[#005588] transition-colors"
        >
          <Plus className="w-5 h-5 mr-2" />
          Add Event
        </button>
      </div>

      {loading ? (
        <div className="flex items-center justify-center py-8">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#006699]"></div>
        </div>
      ) : events.length === 0 ? (
        <div className="text-center py-8">
          <p className="text-gray-600">No events found</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {events.map((event) => (
            <div
              key={event.id}
              className="bg-white rounded-lg shadow-sm overflow-hidden hover:shadow-md transition-shadow"
            >
              <div className="p-6">
                <div className="flex justify-between items-start mb-4">
                  <h3 className="text-lg font-semibold text-[#333333]">{event.title}</h3>
                  <div className="flex space-x-2">
                    <button
                      className="p-1 text-blue-600 hover:text-blue-800"
                      title="Edit"
                      onClick={() => {
                        setSelectedEvent(event);
                        setFormData({
                          title: event.title,
                          description: event.description,
                          date: event.date,
                          time: event.time,
                          location: event.location,
                          attendees: event.attendees,
                        });
                        setIsModalOpen(true);
                      }}
                    >
                      <Edit2 className="w-4 h-4" />
                    </button>
                    <button
                      className="p-1 text-red-600 hover:text-red-800"
                      title="Delete"
                      onClick={() => handleDelete(event.id)}
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
                <p className="text-gray-600 mb-4">{event.description}</p>
                <div className="space-y-2">
                  <div className="flex items-center text-sm text-[#333333]">
                    <Calendar className="w-4 h-4 mr-2 text-gray-400" />
                    {new Date(event.date).toLocaleDateString()}
                  </div>
                  <div className="flex items-center text-sm text-[#333333]">
                    <Clock className="w-4 h-4 mr-2 text-gray-400" />
                    {event.time}
                  </div>
                  <div className="flex items-center text-sm text-[#333333]">
                    <MapPin className="w-4 h-4 mr-2 text-gray-400" />
                    {event.location}
                  </div>
                  <div className="flex items-center text-sm text-[#333333]">
                    <Users className="w-4 h-4 mr-2 text-gray-400" />
                    {event.attendees} attendees
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Event Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-lg shadow-xl w-full max-w-md">
            <div className="p-6">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-xl font-bold text-[#333333]">
                  {selectedEvent ? 'Edit Event' : 'Add New Event'}
                </h2>
                <button
                  onClick={() => {
                    setIsModalOpen(false);
                    setSelectedEvent(null);
                  }}
                  className="text-gray-500 hover:text-gray-700"
                >
                  ×
                </button>
              </div>

              <form onSubmit={selectedEvent ? handleUpdate : handleSubmit}>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-[#333333] mb-1">
                      Title
                    </label>
                    <input
                      type="text"
                      value={formData.title}
                      onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#006699]"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-[#333333] mb-1">
                      Description
                    </label>
                    <textarea
                      value={formData.description}
                      onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#006699]"
                      rows={3}
                      required
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-[#333333] mb-1">
                        Date
                      </label>
                      <input
                        type="date"
                        value={formData.date}
                        onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#006699]"
                        required
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-[#333333] mb-1">
                        Time
                      </label>
                      <input
                        type="time"
                        value={formData.time}
                        onChange={(e) => setFormData({ ...formData, time: e.target.value })}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#006699]"
                        required
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-[#333333] mb-1">
                      Location
                    </label>
                    <input
                      type="text"
                      value={formData.location}
                      onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#006699]"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-[#333333] mb-1">
                      Expected Attendees
                    </label>
                    <input
                      type="number"
                      value={formData.attendees}
                      onChange={(e) => setFormData({ ...formData, attendees: parseInt(e.target.value) })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#006699]"
                      min="0"
                      required
                    />
                  </div>
                </div>

                <div className="flex justify-end space-x-3 mt-6">
                  <button
                    type="button"
                    onClick={() => {
                      setIsModalOpen(false);
                      setSelectedEvent(null);
                    }}
                    className="px-4 py-2 border border-gray-300 rounded-lg text-[#333333] hover:bg-gray-50"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-2 bg-[#006699] text-white rounded-lg hover:bg-[#005588]"
                  >
                    {selectedEvent ? 'Update Event' : 'Create Event'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  );
} 