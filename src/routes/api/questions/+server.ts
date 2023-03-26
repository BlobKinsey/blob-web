import { error, json } from '@sveltejs/kit';
import { getGSheetData } from '$lib/sheet/googleSheetService';
import type { RequestHandler } from './$types';

 
export const GET = (async () => {
  const doc = await getGSheetData();
  
  return json(doc);
}) satisfies RequestHandler