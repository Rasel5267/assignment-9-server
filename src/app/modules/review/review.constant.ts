export const reviewFilterableFields: string[] = [
  'searchTerm',
  'rating',
  'customerId',
  'tourPackageId'
];

export const reviewSearchableFields: string[] = ['comment'];

export const reviewRelationalFields: string[] = ['customerId', 'tourPackageId'];
export const reviewRelationalFieldsMapper: { [key: string]: string } = {
  customerId: 'customer',
  tourPackageId: 'tourPackage'
};
