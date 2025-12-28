import * as tf from '@tensorflow/tfjs';

// Change type to GraphModel
let model: tf.GraphModel | null = null;
let isLoading = false;

export const loadModel = async () => {
  if (model) return; 
  if (isLoading) return;

  isLoading = true;
  try {
    console.log("⏳ Loading Pothole Graph Model...");
    
    // --- CHANGE 1: Use loadGraphModel ---
    model = await tf.loadGraphModel('/tfjs_model/model.json');
    
    console.log("✅ Pothole AI Model Loaded Successfully");
  } catch (err) {
    console.error("❌ Failed to load Pothole AI model", err);
    console.error("Make sure model.json is in public/tfjs_model/ folder");
  } finally {
    isLoading = false;
  }
};

export const detectPothole = async (imageElement: HTMLImageElement): Promise<number> => {
  if (!model) {
    console.warn("⚠️ Model was not ready. Attempting to load now...");
    await loadModel();
    if (!model) {
      console.error("❌ Model failed to load. Cannot predict.");
      return 0;
    }
  }

  try {
    const tensor = tf.tidy(() => {
      // 1. Resize to 300x300
      let imgTensor = tf.browser.fromPixels(imageElement)
        .resizeNearestNeighbor([300, 300]) 
        .toFloat();

      // 2. Convert to Grayscale (3 channels -> 1 channel)
      let grayscaleTensor = imgTensor.mean(2);

      // 3. Reshape to [1, 300, 300, 1]
      let finalTensor = grayscaleTensor.expandDims(2).expandDims(0);
      
      // 4. Normalize (0 to 1)
      return finalTensor.div(255.0);
    });

    // --- CHANGE 2: Graph Models use predict() but return a Tensor directly ---
    const result = model.predict(tensor) as tf.Tensor;
    const data = await result.data(); 
    
    // Cleanup
    tensor.dispose();
    result.dispose();

    console.log("AI Prediction Result:", data);

    if (data.length > 1) {
        return data[1];
    }
    return data[0];

  } catch (error) {
    console.error("Prediction error:", error);
    return 0;
  }
};