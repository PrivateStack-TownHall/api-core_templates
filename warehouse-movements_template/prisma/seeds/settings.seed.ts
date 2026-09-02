// Singleton by design - SettingsService.create() akan update record yang
// sudah ada kalau dipanggil lagi, jadi sengaja cuma 1 record di sini.
export async function seedSettings(prisma: any) {
  const settings = await prisma.setting.create({
    data: {
      warehouseName: 'WareTrack HQ',
      warehouseCode: 'WH-HQ',
      warehouseAddress: 'Jl. Industri No. 1',
      warehouseCapacity: 10000,
    },
  });
  return [settings];
}
