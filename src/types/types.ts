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

export type submitTask = {
name: string,
description: string,
due_date: string,
employee: string,
priority: string,
status: string
department: string
}

export type postTask = {
  id: number,
  name: string,
  description: string,
  due_date: string,
  status: {
    id: number,
    name: string
  },
  priority: {
    id: number,
    name: string,
    icon: string
  },
  department: {
    id: number,
    name: string
  },
  employee: {
    id: number,
    name: string,
    surname: string,
    avatar: string,
    department_id: number
  }
}