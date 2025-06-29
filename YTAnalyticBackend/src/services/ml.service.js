const tf = require('@tensorflow/tfjs');


// Load model, predict subscriber growth or video performance
async function predictGrowth(data) {
  const model = await tf.loadLayersModel('file://model/model.json');
  const input = tf.tensor2d([data]); // Ensure correct shape
  return model.predict(input).array();
}

module.exports = { predictGrowth };

