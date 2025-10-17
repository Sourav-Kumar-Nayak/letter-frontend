# Letter Frontend

A real-time chat application built with Next.js 15, React 19, and WebSocket communication using STOMP protocol.

## Features

- **Real-time Chat**: WebSocket-based messaging using STOMP over SockJS
- **User Authentication**: Login system with JWT token-based authentication
- **User Management**: User list and online/offline status tracking
- **Modern UI**: Built with React 19 and Tailwind CSS
- **Type-Safe**: Written in TypeScript for enhanced development experience

## Tech Stack

- **Framework**: Next.js 15.5.5 (React 19.1.0)
- **Styling**: Tailwind CSS with PostCSS
- **WebSocket**: STOMP.js 7.2.1 with SockJS Client 1.6.1
- **Language**: TypeScript
- **Package Manager**: npm


## Getting Started

### Prerequisites

- Node.js (recommended version: 18.x or higher)
- npm

### Installation

1. Clone the repository:


2. Install dependencies:


3. Set up environment variables:

Create a `.env.local` file in the root directory with the following variables:



### Development

Run the development server:


Open [http://localhost:3000](http://localhost:3000) with your browser to see the application.

### Build

Create a production build:


### Run Production Build


## Features Overview

### Authentication
- User login with username and password
- JWT token-based session management
- Automatic token refresh
- Protected routes

### Chat
- Real-time messaging with WebSocket
- User list with online/offline status
- Message history
- Typing indicators (if implemented)
- Message persistence

### Real-time Updates
- STOMP protocol over SockJS for reliable WebSocket connections
- Automatic reconnection on connection loss
- Topic-based message subscription

## API Integration

The application connects to a backend API for:
- User authentication
- Message retrieval and sending
- User management

All API endpoints are configured through the `NEXT_PUBLIC_API_URL` environment variable.

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

[Add your license here]

## Contact

[Add your contact information here]
