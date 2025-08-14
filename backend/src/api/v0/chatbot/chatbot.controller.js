import asyncHandler from '../../../utils/asyncHandler.js';
import chatbotService from './chatbot.service.js';

export const processMessage = asyncHandler(async (req, res, next) => {
  const { currentState, userInput, selectedOption } = req.body;
  const response = await chatbotService.handleConversation({
    userId: req.user.id,
    userName: req.user.name,
    currentState,
    userInput,
    selectedOption,
  });
  res.status(200).json(response);
});