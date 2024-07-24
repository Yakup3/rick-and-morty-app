export interface Location {
  id: number;
  url: string;
  name: string;
}

export interface Character {
  id: number;
  url: string;
  name: string;
  image: string;
  status: string;
  location: {
    name: string;
    url: string;
  };
}

export interface Info {
  count: number;
  pages: number;
  next: string;
  prev: string;
}

export interface Status {
  title: string;
  value: string;
}
