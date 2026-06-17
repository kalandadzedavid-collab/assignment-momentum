export type Inputs = {
  name: string;
  surname: string;
  image: FileList;
  department_id: number;
};

export type priorities = {
  id: number;
  name: string;
  icon: string;
};

export type statuses = {
  id: number;
  name: string;
};

export type departments = {
  id: number;
  name: string;
};

export type employees = {
  id: number;
  name: string;
  surname: string;
  avatar: string,
  department_id: number
};
