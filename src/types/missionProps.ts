export type Rocket = {
  id: number;
  configuration: {
    id: number;
    url: string;
    name: string;
    active: boolean;
    reusable: boolean;
    description: string;
    family: string;
    full_name: string;
    program?: {
      id: number;
      url: string;
      name: string;
      description: string;
      agencies: {
        id: number;
        url: string;
        name: string;
        type: string;
      }[];
      image_url: string;
      start_date: string;
      end_date: string | null;
      info_url: string | null;
      wiki_url: string;
      mission_patches: unknown[];
      type: {
        id: number;
        name: string;
      };
    }[];
    variant: string;
    alias: string;
    min_stage: number;
    max_stage: number;
    length: number;
    diameter: number;
    maiden_flight: string;
    launch_cost: string;
    launch_mass: number;
    leo_capacity: number;
    gto_capacity: number;
    to_thrust: number;
    apogee: number;
    vehicle_range: number | null;
    image_url: string;
    info_url: string;
    wiki_url: string;
    total_launch_count: number;
    consecutive_successful_launches: number;
    successful_launches: number;
    failed_launches: number;
    pending_launches: number;
    attempted_landings: number;
    successful_landings: number;
    failed_landings: number;
    consecutive_successful_landings: number;
  };
  launcher_stage: {
    id: number;
    type: string;
    reused: boolean | null;
    launcher_flight_number: number | null;
    launcher: {
      id: number;
      url: string;
      details: string;
      flight_proven: boolean;
      serial_number: string;
      status: string;
      image_url: string;
      successful_landings: number | null;
      attempted_landings: number | null;
      flights: number | null;
      last_launch_date: string | null;
      first_launch_date: string | null;
    };
    landing: {
      id: number;
      attempt: boolean;
      success: boolean | null;
      description: string;
      downrange_distance: number | null;
      location: {
        id: number;
        name: string;
        abbrev: string;
        description: string | null;
        location: string | null;
        successful_landings: number;
      };
      type: {
        id: number;
        name: string;
        abbrev: string;
        description: string;
      };
    };
    previous_flight_date: string | null;
    turn_around_time_days: number | null;
    previous_flight: string | null;
  }[];
  spacecraft_stage: unknown | null;
};

export type Provider = {
  id: number;
  url: string;
  name: string;
  featured: boolean;
  type: string;
  country_code: string;
  abbrev: string;
  description: string;
  administrator: string;
  founding_year: string;
  launchers: string;
  spacecraft: string;
  launch_library_url: string | null;
  total_launch_count: number;
  consecutive_successful_launches: number;
  successful_launches: number;
  failed_launches: number;
  pending_launches: number;
  consecutive_successful_landings: number;
  successful_landings: number;
  failed_landings: number;
  attempted_landings: number;
  info_url: string;
  wiki_url: string;
  logo_url: string;
  image_url: string;
  nation_url: string;
};

export type Mission = {
  id: string;
  url: string;
  slug: string;
  name: string;
  status: {
    id: number;
    name: string;
    abbrev: string;
    description: string;
  };
  last_updated: string;
  net: string;
  window_end: string;
  window_start: string;
  net_precision: {
    id: number;
    name: string;
    abbrev: string;
    description: string;
  };
  probability: number;
  weather_concerns: string | null;
  holdreason: string;
  failreason: string;
  hashtag: string | null;
  launch_service_provider: Provider;
  rocket: Rocket;
  mission: {
    id: number;
    name: string;
    description: string;
    launch_designator: string | null;
    type: string;
    orbit: {
      id: number;
      name: string;
      abbrev: string;
    };
    agencies: {
      id: number;
      url: string;
      name: string;
      featured: boolean;
      type: string;
      country_code: string;
      abbrev: string;
      description: string;
      administrator: string;
      founding_year: string;
      launchers: string;
      spacecraft: string;
      launch_library_url: string | null;
      total_launch_count: number;
      consecutive_successful_launches: number;
      successful_launches: number;
      failed_launches: number;
      pending_launches: number;
      consecutive_successful_landings: number;
      successful_landings: number;
      failed_landings: number;
      attempted_landings: number;
      info_url: string;
      wiki_url: string;
      logo_url: string;
      image_url: string;
      nation_url: string;
    }[];
    info_urls: string[];
    vid_urls: string[];
  };
  pad: {
    id: number;
    url: string;
    agency_id: number;
    name: string;
    description: string | null;
    info_url: string | null;
    wiki_url: string;
    map_url: string;
    latitude: string;
    longitude: string;
    location: {
      id: number;
      url: string;
      name: string;
      country_code: string;
      description: string;
      map_image: string;
      timezone_name: string;
      total_launch_count: number;
      total_landing_count: number;
    };
    country_code: string;
    map_image: string;
    total_launch_count: number;
    orbital_launch_attempt_count: number;
  };
  vidURLs: {
    url: string;
    description: string;
    feature_image: string;
  }[];
  webcast_live: boolean;
  image: string;
  program: {
    id: number;
    name: string;
    description: string;
    image_url: string;
    mission_patches: {
      id: number;
      name: string;
      image_url: string;
    }[];
    type: {
      id: number;
      name: string;
    };
  }[];
  infographic: string | null;
  orbital_launch_attempt_count: number;
  location_launch_attempt_count: number;
  pad_launch_attempt_count: number;
  agency_launch_attempt_count: number;
  orbital_launch_attempt_count_year: number;
  location_launch_attempt_count_year: number;
  pad_launch_attempt_count_year: number;
  agency_launch_attempt_count_year: number;
  type: string;
};

export type MissionResponse = {
  results: Mission[];
};

export type Item = {
  item: Mission;
};
