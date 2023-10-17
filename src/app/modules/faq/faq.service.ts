import { Faq } from '@prisma/client';
import prisma from '../../../shared/prisma';

const CreateFAQ = async (payload: Faq): Promise<Faq> => {
  const result = await prisma.faq.create({
    data: payload
  });

  return result;
};

const GetAllFAQ = async (): Promise<Faq[] | null> => {
  const result = await prisma.faq.findMany();

  return result;
};

const GetFAQById = async (id: string): Promise<Faq | null> => {
  const result = await prisma.faq.findUnique({
    where: {
      id
    }
  });

  return result;
};

const UpdateFAQ = async (id: string, payload: Partial<Faq>): Promise<Faq> => {
  const result = await prisma.faq.update({
    where: {
      id
    },
    data: payload
  });

  return result;
};

const DeleteFAQ = async (id: string): Promise<Faq> => {
  const result = await prisma.faq.delete({
    where: {
      id
    }
  });

  return result;
};

export const FAQService = {
  CreateFAQ,
  GetAllFAQ,
  GetFAQById,
  UpdateFAQ,
  DeleteFAQ
};
