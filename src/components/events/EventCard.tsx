import Image from "next/image";
import Link from "next/link";

interface EventCardProps {
  id: number;
  title: string;
  description: string;
  date: Date;
  location: string;
  category: string;
  imageUrl?: string | null;
}

const EventCard = ({ event }: { event: EventCardProps }) => {
  const formattedDate = new Date(event.date).toLocaleDateString("es-ES", {
    weekday: "long",
    day: "numeric",
    month: "long",
  });
  const formattedTime = new Date(event.date).toLocaleTimeString("es-ES", {
    hour: "2-digit",
    minute: "2-digit",
  });

  return (
    <div className="flex flex-col md:flex-row gap-4 p-4 bg-white rounded-lg shadow-md">
      {/* Event Image */}
      {event.imageUrl ? (
        <div className="w-full md:w-1/3 h-40 relative flex-shrink-0">
          <Image
            src={event.imageUrl}
            alt={event.title}
            fill
            className="object-cover rounded-md"
          />
        </div>
      ) : (
        <div className="w-full md:w-1/3 h-40 relative flex-shrink-0 bg-blue-100 flex flex-col items-center justify-center rounded-md text-blue-500">
          <span className="text-4xl font-bold">{new Date(event.date).getDate()}</span>
          <span className="text-lg font-medium">{new Date(event.date).toLocaleDateString("es-ES", { month: "short" }).toUpperCase()}</span>
        </div>
      )}

      {/* Event Details */}
      <div className="flex flex-col justify-between flex-1 gap-2">
        <div>
          <div className="flex justify-between items-start">
            <h2 className="text-xl font-bold text-gray-800">{event.title}</h2>
            <span className="text-xs px-2 py-1 bg-gray-100 text-gray-600 rounded-full font-medium">
              {event.category}
            </span>
          </div>
          <p className="text-sm text-gray-500 mt-1 line-clamp-2">
            {event.description}
          </p>
        </div>

        <div className="flex flex-col sm:flex-row gap-4 text-sm text-gray-500 mt-4 sm:items-center">
          <div className="flex items-center gap-1">
            <Image src="/date.png" alt="" width={16} height={16} />
            <span>{formattedDate} - {formattedTime}</span>
          </div>
          <div className="flex items-center gap-1">
            <svg
              className="w-4 h-4 text-gray-400"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
            </svg>
            <span>{event.location}</span>
          </div>
        </div>

        {/* Action Button */}
        <div className="mt-2">
          <Link href={`/events/${event.id}`}>
            <button className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600 font-semibold transition-colors w-full sm:w-auto">
              Ver Detalles
            </button>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default EventCard;
