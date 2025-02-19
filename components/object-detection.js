"use client";

import React, { useEffect, useRef, useState } from "react";
import Webcam from "react-webcam";
import { load as cocoSSDLoad } from "@tensorflow-models/coco-ssd";
import * as tf from "@tensorflow/tfjs";
import { renderPredictions } from "@/utils/render-predictions";

const ObjectDetection = () => {
  const [isLoading, setIsLoading] = useState(true);
  const webcamRef = useRef(null);
  const canvasRef = useRef(null);
  let detectInterval = null;

  useEffect(() => {
    const loadModel = async () => {
      await tf.ready(); // Ensure TensorFlow.js is loaded
      setIsLoading(true);
      const net = await cocoSSDLoad();
      setIsLoading(false);

      detectInterval = setInterval(() => {
        runObjectDetection(net);
      }, 100); // Avoid excessive execution (10ms is too frequent)
    };

    loadModel();

    return () => {
      if (detectInterval) {
        clearInterval(detectInterval);
      }
    };
  }, []);

  async function runObjectDetection(net) {
    if (
      webcamRef.current?.video?.readyState === 4 &&
      canvasRef.current
    ) {
      const video = webcamRef.current.video;
      const canvas = canvasRef.current;
      const context = canvas.getContext("2d");

      canvas.width = video.videoWidth;
      canvas.height = video.videoHeight;

      const detectedObjects = await net.detect(video);
      renderPredictions(detectedObjects, context);
    }
  }

  return (
    <div className="mt-8">
      {isLoading ? (
        <div className="gradient-text">Loading AI Model...</div>
      ) : (
        <div className="relative flex justify-center items-center gradient p-1.5 rounded-md">
          {/* Webcam */}
          <Webcam ref={webcamRef} className="rounded-md w-full lg:h-[720px]" muted />
          {/* Canvas */}
          <canvas ref={canvasRef} className="absolute top-0 left-0 z-50 w-full lg:h-[720px]" />
        </div>
      )}
    </div>
  );
};

export default ObjectDetection;
