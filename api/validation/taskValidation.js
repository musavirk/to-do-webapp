import Joi from 'joi';

const taskValidation = Joi.object({
  title: Joi.string().required(),
  description: Joi.string().required(),
  status: Joi.string().valid('Done', 'To Do').default('To Do'),
});

export default taskValidation;
