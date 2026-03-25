/**
 * Audio Collector
 * Mengumpulkan data dari AudioContext API untuk fingerprinting
 * Teknik: Oscillator dan dynamics compressor untuk mendeteksi perbedaan audio processing
 */

import { AudioData } from "../types";
import { hashString } from "../utils";

export class AudioCollector {
  name = "audio";
  enabled = true;

  async collect(): Promise<AudioData> {
    const result: AudioData = {
      available: false,
      hash: "",
      sampleRate: 0,
      channelCount: 0,
      state: "",
    };

    try {
      const AudioContextClass =
        (window as any).AudioContext || (window as any).webkitAudioContext;

      if (!AudioContextClass) {
        return result;
      }

      const audioContext = new AudioContext();
      result.available = true;
      result.sampleRate = audioContext.sampleRate;
      result.channelCount = audioContext.destination.channelCount;
      result.state = audioContext.state;

      // Audio fingerprinting technique
      const oscillator = audioContext.createOscillator();
      const analyser = audioContext.createAnalyser();
      const gainNode = audioContext.createGain();
      const compressor = audioContext.createDynamicsCompressor();

      // Compressor settings for fingerprinting
      compressor.threshold.value = -50;
      compressor.knee.value = 40;
      compressor.ratio.value = 12;
      compressor.attack.value = 0.003;
      compressor.release.value = 0.25;

      // Connect nodes
      oscillator.connect(analyser);
      analyser.connect(gainNode);
      gainNode.connect(compressor);
      compressor.connect(audioContext.destination);

      // Configure oscillator
      oscillator.type = "triangle";
      oscillator.frequency.value = 1000;

      // Configure analyser
      analyser.fftSize = 2048;
      analyser.smoothingTimeConstant = 0.5;

      // Start and stop
      oscillator.start(0);
      oscillator.stop(audioContext.currentTime + 0.1);

      // Get frequency data for fingerprint
      const bufferLength = analyser.frequencyBinCount;
      const dataArray = new Uint8Array(bufferLength);
      analyser.getByteFrequencyData(dataArray);

      // Generate hash from audio data
      const audioData = Array.from(dataArray).join(",");
      result.hash = hashString(
        audioData + result.sampleRate + result.channelCount,
      );

      // Cleanup
      setTimeout(() => {
        audioContext.close();
      }, 100);
    } catch (error) {
      // Silent mode - no warnings
      // console.warn('AudioCollector error:', error);
    }

    return result;
  }
}
