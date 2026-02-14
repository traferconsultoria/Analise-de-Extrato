
import { GoogleGenAI, Type } from "@google/genai";
import { BankStatementData } from "../types";

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

export async function parseStatementText(text: string): Promise<BankStatementData> {
  const response = await ai.models.generateContent({
    model: 'gemini-3-flash-preview',
    contents: `Analise o seguinte texto extraído de um extrato bancário e extraia todas as transações em um formato JSON estruturado. 
    Identifique o nome do banco e o período se possível.
    
    Texto do extrato:
    ${text}
    `,
    config: {
      responseMimeType: "application/json",
      responseSchema: {
        type: Type.OBJECT,
        properties: {
          bankName: { type: Type.STRING, description: 'Nome do banco' },
          period: { type: Type.STRING, description: 'Período do extrato' },
          transactions: {
            type: Type.ARRAY,
            items: {
              type: Type.OBJECT,
              properties: {
                date: { type: Type.STRING, description: 'Data da transação (DD/MM/AAAA)' },
                description: { type: Type.STRING, description: 'Descrição ou nome do favorecido/pagador' },
                amount: { type: Type.NUMBER, description: 'Valor numérico positivo' },
                type: { 
                  type: Type.STRING, 
                  description: 'CREDIT para entradas ou DEBIT para saídas',
                  enum: ['CREDIT', 'DEBIT']
                }
              },
              required: ['date', 'description', 'amount', 'type']
            }
          }
        },
        required: ['transactions']
      },
      systemInstruction: "Você é um especialista em análise de documentos financeiros. Sua tarefa é converter texto bruto de extratos bancários em dados JSON limpos e normalizados. Ignore taxas de cabeçalho irrelevantes, foque nas linhas de transação. Certifique-se de que valores negativos sejam identificados como DEBIT e positivos como CREDIT."
    }
  });

  if (!response.text) {
    throw new Error("Falha ao processar o extrato com IA.");
  }

  return JSON.parse(response.text.trim()) as BankStatementData;
}
