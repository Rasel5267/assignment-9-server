export const orderFilterableFields: string[] = [
  'searchTerm',
  'price',
  'travelDate',
  'orderStatus',
  'quantity',
  'customerId',
  'tourPackageId'
];

export const orderSearchableFields: string[] = [];

export const orderRelationalFields: string[] = ['customerId', 'tourPackageId'];
export const orderRelationalFieldsMapper: { [key: string]: string } = {
  customerId: 'customer',
  tourPackageId: 'tourPackage'
};
