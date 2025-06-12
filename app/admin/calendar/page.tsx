'use client';

import { useState } from 'react';
import { Calendar as BigCalendar, dateFnsLocalizer, Event as CalendarEvent, Views, View } from 'react-big-calendar';
import { format, parse, startOfWeek, getDay } from 'date-fns';
import { Plus, X, Trash2, Edit2, Calendar, Clock, List, Download } from 'lucide-react';
import ical from 'ical-generator';
import 'react-big-calendar/lib/css/react-big-calendar.css';

// Types
interface Event extends CalendarEvent {
  id: string;
  description: string;
}

// Calendar localization
const locales = {
  'en-US': require('date-fns/locale/en-US'),
};

const localizer = dateFnsLocalizer({
  format,
  parse,
  startOfWeek,
  getDay,
  locales,
});

// Example events
const exampleEvents: Event[] = [
  {
    id: '1',
    title: 'System Maintenance',
    start: new Date(2024, 2, 20, 10, 0),
    end: new Date(2024, 2, 20, 12, 0),
    description: 'Regular system maintenance and updates',
  },
  {
    id: '2',
    title: 'Team Meeting',
    start: new Date(2024, 2, 21, 14, 0),
    end: new Date(2024, 2, 21, 15, 0),
    description: 'Weekly team sync meeting',
  },
  {
    id: '3',
    title: 'New Employee Onboarding',
    start: new Date(2024, 2, 22, 9, 0),
    end: new Date(2024, 2, 22, 11, 0),
    description: 'IT setup and orientation for new hires',
  },
];

export default function CalendarPage() {
  const [events, setEvents] = useState<Event[]>(exampleEvents);
  const [showModal, setShowModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [selectedEvent, setSelectedEvent] = useState<Event | null>(null);
  const [view, setView] = useState<View>(Views.MONTH);
  const [newEvent, setNewEvent] = useState<Partial<Event>>({
    title: '',
    start: new Date(),
    end: new Date(),
    description: '',
  });

  const handleCreateEvent = () => {
    if (newEvent.title && newEvent.start && newEvent.end && newEvent.description) {
      const event: Event = {
        id: Math.random().toString(36).substr(2, 9),
        title: newEvent.title,
        start: newEvent.start,
        end: newEvent.end,
        description: newEvent.description,
      };
      setEvents([...events, event]);
      setShowModal(false);
      setNewEvent({
        title: '',
        start: new Date(),
        end: new Date(),
        description: '',
      });
    }
  };

  const handleEditEvent = () => {
    if (selectedEvent && newEvent.title && newEvent.start && newEvent.end && newEvent.description) {
      const updatedEvents = events.map((event) =>
        event.id === selectedEvent.id
          ? {
              ...event,
              title: newEvent.title as string,
              start: newEvent.start,
              end: newEvent.end,
              description: newEvent.description as string,
            }
          : event
      );
      setEvents(updatedEvents);
      setShowModal(false);
      setSelectedEvent(null);
      setNewEvent({
        title: '',
        start: new Date(),
        end: new Date(),
        description: '',
      });
    }
  };

  const handleDeleteEvent = () => {
    if (selectedEvent) {
      setEvents(events.filter((event) => event.id !== selectedEvent.id));
      setShowDeleteModal(false);
      setSelectedEvent(null);
    }
  };

  const handleEventClick = (event: Event) => {
    setSelectedEvent(event);
    setNewEvent({
      title: event.title,
      start: event.start,
      end: event.end,
      description: event.description,
    });
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setShowDeleteModal(false);
    setSelectedEvent(null);
    setNewEvent({
      title: '',
      start: new Date(),
      end: new Date(),
      description: '',
    });
  };

  const handleExportEvents = () => {
    const calendar = ical({ name: 'NextPhase IT Events' });

    events.forEach((event) => {
      if (event.start && event.end && event.title && event.description) {
        calendar.createEvent({
          start: event.start,
          end: event.end,
          summary: event.title.toString(),
          description: event.description,
          url: window.location.href,
        });
      }
    });

    const blob = new Blob([calendar.toString()], { type: 'text/calendar;charset=utf-8' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = 'nextphase-events.ics';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-[#333333]">Calendar & Events</h1>
        <div className="flex items-center space-x-4">
          <div className="flex bg-white rounded-lg shadow-sm">
            <button
              onClick={() => setView(Views.MONTH)}
              className={`px-3 py-2 rounded-l-lg ${
                view === Views.MONTH ? 'bg-[#006699] text-white' : 'text-gray-600 hover:bg-gray-50'
              }`}
            >
              <Calendar className="w-5 h-5" />
            </button>
            <button
              onClick={() => setView(Views.WEEK)}
              className={`px-3 py-2 ${
                view === Views.WEEK ? 'bg-[#006699] text-white' : 'text-gray-600 hover:bg-gray-50'
              }`}
            >
              <Clock className="w-5 h-5" />
            </button>
            <button
              onClick={() => setView(Views.AGENDA)}
              className={`px-3 py-2 rounded-r-lg ${
                view === Views.AGENDA ? 'bg-[#006699] text-white' : 'text-gray-600 hover:bg-gray-50'
              }`}
            >
              <List className="w-5 h-5" />
            </button>
          </div>
          <button
            onClick={handleExportEvents}
            className="flex items-center px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
          >
            <Download className="w-5 h-5 mr-2" />
            Export to iCal
          </button>
          <button
            onClick={() => {
              setSelectedEvent(null);
              setNewEvent({
                title: '',
                start: new Date(),
                end: new Date(),
                description: '',
              });
              setShowModal(true);
            }}
            className="flex items-center px-4 py-2 bg-[#006699] text-white rounded-lg hover:bg-[#005580] transition-colors"
          >
            <Plus className="w-5 h-5 mr-2" />
            New Event
          </button>
        </div>
      </div>

      {/* Calendar Component */}
      <div className="bg-white rounded-lg shadow-sm p-6">
        <div className="h-[600px]">
          <BigCalendar
            localizer={localizer}
            events={events}
            startAccessor="start"
            endAccessor="end"
            style={{ height: '100%' }}
            view={view}
            onView={(newView: View) => setView(newView)}
            onSelectEvent={handleEventClick}
            eventPropGetter={(event: Event) => ({
              style: {
                backgroundColor: '#006699',
                borderRadius: '4px',
              },
            })}
          />
        </div>
      </div>

      {/* Event Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-md">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-semibold text-[#333333]">
                {selectedEvent ? 'Edit Event' : 'Create New Event'}
              </h2>
              <button onClick={handleCloseModal} className="text-gray-500 hover:text-gray-700">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Event Title
                </label>
                <input
                  type="text"
                  value={newEvent.title}
                  onChange={(e) => setNewEvent({ ...newEvent, title: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#006699]"
                  placeholder="Enter event title"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Start Date & Time
                  </label>
                  <input
                    type="datetime-local"
                    value={format(newEvent.start || new Date(), "yyyy-MM-dd'T'HH:mm")}
                    onChange={(e) =>
                      setNewEvent({ ...newEvent, start: new Date(e.target.value) })
                    }
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#006699]"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    End Date & Time
                  </label>
                  <input
                    type="datetime-local"
                    value={format(newEvent.end || new Date(), "yyyy-MM-dd'T'HH:mm")}
                    onChange={(e) =>
                      setNewEvent({ ...newEvent, end: new Date(e.target.value) })
                    }
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#006699]"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Description
                </label>
                <textarea
                  value={newEvent.description}
                  onChange={(e) => setNewEvent({ ...newEvent, description: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#006699] h-24"
                  placeholder="Enter event description"
                />
              </div>

              <div className="flex justify-between items-center">
                {selectedEvent && (
                  <button
                    onClick={() => {
                      setShowModal(false);
                      setShowDeleteModal(true);
                    }}
                    className="flex items-center px-4 py-2 text-red-600 hover:text-red-700"
                  >
                    <Trash2 className="w-5 h-5 mr-2" />
                    Delete Event
                  </button>
                )}
                <div className="flex space-x-3">
                  <button
                    onClick={handleCloseModal}
                    className="px-4 py-2 text-gray-700 hover:text-gray-900"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={selectedEvent ? handleEditEvent : handleCreateEvent}
                    className="flex items-center px-4 py-2 bg-[#006699] text-white rounded-lg hover:bg-[#005580] transition-colors"
                  >
                    {selectedEvent ? (
                      <>
                        <Edit2 className="w-5 h-5 mr-2" />
                        Save Changes
                      </>
                    ) : (
                      'Create Event'
                    )}
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {showDeleteModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-md">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-semibold text-[#333333]">Delete Event</h2>
              <button onClick={handleCloseModal} className="text-gray-500 hover:text-gray-700">
                <X className="w-5 h-5" />
              </button>
            </div>

            <p className="text-gray-600 mb-6">
              Are you sure you want to delete this event? This action cannot be undone.
            </p>

            <div className="flex justify-end space-x-3">
              <button
                onClick={handleCloseModal}
                className="px-4 py-2 text-gray-700 hover:text-gray-900"
              >
                Cancel
              </button>
              <button
                onClick={handleDeleteEvent}
                className="flex items-center px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
              >
                <Trash2 className="w-5 h-5 mr-2" />
                Delete Event
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
