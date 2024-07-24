import React, {useState, useEffect, createRef} from 'react';
import {SafeAreaView, StyleSheet} from 'react-native';
import {Modalize} from 'react-native-modalize';
import {GestureHandlerRootView} from 'react-native-gesture-handler';

import {Location, Status} from './src/services/models';
import CharacterList from './src/components/CharacterList';
import FilterModalize from './src/components/FilterModalize';
import {DEFAULT_BASE_LOCATION_URL, fetchLocations} from './src/services/api';

const App: React.FC = () => {
  const modalizeRef = createRef<Modalize>();
  const [status, setStatus] = useState<Status>();
  const [location, setLocation] = useState<Location>();
  const [locations, setLocations] = useState<Location[]>([]);

  useEffect(() => {
    _fetchLocations();
  }, []);

  const _fetchLocations = async () => {
    try {
      let allLocations: Location[] = [];
      let nextPageUrl = DEFAULT_BASE_LOCATION_URL;

      while (nextPageUrl) {
        const response = await fetchLocations(nextPageUrl);
        allLocations = [...allLocations, ...response.results];
        nextPageUrl = response.info.next;
      }

      allLocations = allLocations.map((location: Location) => ({
        id: location.id,
        url: location.url,
        name: location.name,
      }));

      setLocations(allLocations);
    } catch (error) {
      console.error('Error fetching locations:', error);
    }
  };

  const handleOnFilterIcon = () => {
    modalizeRef.current?.open();
  };

  const closeFilterModal = () => {
    modalizeRef.current?.close();
  };

  const handleOnFilter = (
    selectedStatus: Status | undefined,
    selectedLocation: Location | undefined,
  ) => {
    setLocation(selectedLocation);
    setStatus(selectedStatus);
  };

  return (
    <SafeAreaView style={styles.container}>
      <GestureHandlerRootView>
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
});

export default App;
