// dataMapper.ts
export const mapDataToHeaders = (data: any[], headersMapping: Record<string, string>) => {
    return data.map((item) => {
      const mappedItem: any = {};
      for (const [header, key] of Object.entries(headersMapping)) {
        mappedItem[header] = item[key as keyof typeof item];
      }
      return mappedItem;
    });
  };
  