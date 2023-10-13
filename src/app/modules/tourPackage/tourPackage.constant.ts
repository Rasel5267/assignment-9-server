export const tourPackageFilterableFields: string[] = [
  'searchTerm',
  'packageName',
  'duration',
  'price',
  'destinationId'
];

export const tourPackageSearchableFields: string[] = [
  'packageName',
  'duration',
  'description',
  'price'
];

export const tourPackageRelationalFields: string[] = ['destinationId'];
export const tourPackageRelationalFieldsMapper: { [key: string]: string } = {
  destinationId: 'destination'
};
