import React, { useState, useRef, useEffect } from 'react'
import { Play, Pause, Volume2, VolumeX } from "lucide-react"

// Button component
const Button = ({ onClick, children, className = '' }) => (
  <button
    onClick={onClick}
    className={`inline-flex items-center justify-center rounded-md p-2 ${className}`}
  >
    {children}
  </button>
)

// Slider component
const Slider = ({ value, onChange, min, max, step = 1 }) => (
  <input
    type="range"
    min={min}
    max={max}
    step={step}
    value={value}
    onChange={e => onChange(parseFloat(e.target.value))}
    className="w-full"
  />
)

interface VideoPlayerProps {
  src: string
  type?: string
}

export default function VideoPlayer({ src, type = 'video/mp4' }: VideoPlayerProps) {
  const videoRef = useRef<HTMLVideoElement>(null)
  const [isPlaying, setIsPlaying] = useState(false)
  const [volume, setVolume] = useState(1)
  const [currentTime, setCurrentTime] = useState(0)
  const [duration, setDuration] = useState(0)

  useEffect(() => {
    const video = videoRef.current
    if (!video) return

    const updateTime = () => setCurrentTime(video.currentTime)
    const updateDuration = () => setDuration(video.duration)

    video.addEventListener('timeupdate', updateTime)
    video.addEventListener('loadedmetadata', updateDuration)

    return () => {
      video.removeEventListener('timeupdate', updateTime)
      video.removeEventListener('loadedmetadata', updateDuration)
    }
  }, [])

  const togglePlay = () => {
    if (videoRef.current) {
      if (isPlaying) {
        videoRef.current.pause()
      } else {
        videoRef.current.play()
      }
      setIsPlaying(!isPlaying)
    }
  }

  const handleVolumeChange = (newVolume: number) => {
    setVolume(newVolume)
    if (videoRef.current) {
      videoRef.current.volume = newVolume
    }
  }

  const handleSeek = (newTime: number) => {
    setCurrentTime(newTime)
    if (videoRef.current) {
      videoRef.current.currentTime = newTime
    }
  }

  const formatTime = (time: number) => {
    const minutes = Math.floor(time / 60)
    const seconds = Math.floor(time % 60)
    return `${minutes}:${seconds.toString().padStart(2, '0')}`
  }

  return (
    <div className="max-w-2xl mx-auto">
      <video
        ref={videoRef}
        className="w-full rounded-lg shadow-lg"
        src={src}
        type={type}
      >
        Your browser does not support the video tag.
      </video>
      <div className="mt-4 flex items-center space-x-4">
        <Button onClick={togglePlay} className="bg-primary text-primary-foreground hover:bg-primary/90">
          {isPlaying ? <Pause className="h-4 w-4" /> : <Play className="h-4 w-4" />}
        </Button>
        <Slider
          value={currentTime}
          onChange={handleSeek}
          min={0}
          max={duration || 100}
        />
        <span className="text-sm text-gray-500">
          {formatTime(currentTime)} / {formatTime(duration)}
        </span>
        <div className="flex items-center space-x-2">
          {volume > 0 ? <Volume2 className="h-4 w-4" /> : <VolumeX className="h-4 w-4" />}
          <Slider
            value={volume}
            onChange={handleVolumeChange}
            min={0}
            max={1}
            step={0.1}
          />
        </div>
      </div>
    </div>
  )
}