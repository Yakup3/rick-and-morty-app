import React, {useState, useEffect, useCallback, useRef} from 'react';
import {SafeAreaView, StyleSheet} from 'react-native';
import {Modalize} from 'react-native-modalize';
import {GestureHandlerRootView} from 'react-native-gesture-handler';

import {Location, Status} from './src/services/models';
import CharacterList from './src/components/CharacterList';
import FilterModalize from './src/components/FilterModalize';
import {DEFAULT_BASE_LOCATION_URL, fetchLocations} from './src/services/api';

const App: React.FC = () => {
  const modalizeRef = useRef<Modalize>(null);
  const [status, setStatus] = useState<Status | undefined>(undefined);
  const [location, setLocation] = useState<Location | undefined>(undefined);
  const [locations, setLocations] = useState<Location[]>([]);

  useEffect(() => {
    _fetchLocations();
  }, []);

  const _fetchLocations = useCallback(async () => {
    try {
      let allLocations: Location[] = [];
      let nextPageUrl: string | null = DEFAULT_BASE_LOCATION_URL;

      while (nextPageUrl) {
        const response = await fetchLocations(nextPageUrl);
        if (response?.results) {
          allLocations = [...allLocations, ...response.results];
          nextPageUrl = response.info.next;
        } else {
          nextPageUrl = null;
        }
      }

      setLocations(
        allLocations.map(({id, url, name, residents}) => ({
          id,
          url,
          name,
          residents,
        })),
      );
    } catch (error) {
      console.error('Error fetching locations:', error);
    }
  }, []);

  const handleOnFilterIcon = useCallback(() => {
    modalizeRef.current?.open();
  }, []);

  const closeFilterModal = useCallback(() => {
    modalizeRef.current?.close();
  }, []);

  const handleOnFilter = useCallback(
    (
      selectedStatus: Status | undefined,
      selectedLocation: Location | undefined,
    ) => {
      setStatus(selectedStatus);
      setLocation(selectedLocation);
    },
    [],
  );

  return (
    <SafeAreaView style={styles.container}>
      <GestureHandlerRootView style={styles.gestureHandlerContainer}>
        <FilterModalize
          modalizeRef={modalizeRef}
          locations={locations}
          handleOnClose={closeFilterModal}
          handleOnFilter={handleOnFilter}
        />
        <CharacterList
          status={status}
          location={location}
          handleOnFilterIcon={handleOnFilterIcon}
        />
      </GestureHandlerRootView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  gestureHandlerContainer: {
    flex: 1,
  },
});

export default App;
