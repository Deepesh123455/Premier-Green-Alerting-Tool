import { materialsRepository } from '../repositories/materialsRepository';
import { vendorsRepository } from '../repositories/vendorsRepository';
import { incomingReportRepository } from '../repositories/incomingReportRepository';
import { emitNewEvent } from '../sockets';
import { IncomingReportInput, LiveFeedItem } from '../types/event';

export const incomingReportService = {
  createIncomingReport: async (input: IncomingReportInput) => {
    // 1. Find or create material
    const material = await materialsRepository.findOrCreate(input.materialName);

    // 2. Find or create vendor
    const vendor = await vendorsRepository.findOrCreate(input.vendorName, input.tradersCompany);

    // 3. Insert incoming report record
    const record = await incomingReportRepository.insert({
      materialId: material.id,
      vendorId: vendor.id,
      quantity: input.quantity,
      quantityUnit: input.quantityUnit,
      price: input.price,
    });

    // 4. Format unified live feed item and broadcast via Socket.io
    const liveFeedItem: LiveFeedItem = {
      id: record.id,
      type: 'incoming_report',
      created_at: record.created_at,
      details: {
        material: material.name,
        quantity: record.quantity,
        quantityUnit: record.quantity_unit,
        price: record.price,
        vendorName: vendor.vendor_name,
        tradersCompany: vendor.traders_company,
      },
    };

    emitNewEvent('incoming_report', liveFeedItem as unknown as Record<string, unknown>);
    return {
      ...record,
      material: material.name,
      vendorName: vendor.vendor_name,
      tradersCompany: vendor.traders_company,
    };
  },
};
