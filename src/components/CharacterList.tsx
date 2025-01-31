import React, {useCallback, useEffect, useMemo, useState} from 'react';
import {
  Text,
  View,
  Image,
  FlatList,
  StyleSheet,
  ActivityIndicator,
} from 'react-native';
import {Badge} from 'react-native-paper';
import AntDesign from 'react-native-vector-icons/AntDesign';

import colors from '../theme/colors';
import {STATUS} from '../shared/constants';
import {fetchCharacter, fetchCharacters} from '../services/api';
import {Character, Info, Location, Status} from '../services/models';

interface CharacterListProps {
  status: Status | undefined;
  location: Location | undefined;
  handleOnFilterIcon: () => void;
}

const CharacterList: React.FC<CharacterListProps> = ({
  status,
  location,
  handleOnFilterIcon,
}) => {
  const [info, setInfo] = useState<Info>();
  const [loading, setLoading] = useState<boolean>(true);
  const [characters, setCharacters] = useState<Character[]>([]);
  const [page, setPage] = useState<number>(1);
  const [isLoadingMore, setIsLoadingMore] = useState<boolean>(false);
  const [filteredCharacters, setFilteredCharacters] = useState<Character[]>([]);

  useEffect(() => {
    setPage(1);
    if (location) {
      _fetchCharacter();
    } else {
      _fetchCharacters(1, status);
    }
  }, [status, location]);

  const _fetchCharacter = useCallback(async () => {
    try {
      const characterUrls = location?.residents;

      if (!characterUrls) {
        throw new Error('No residents found in location');
      }

      const response = await Promise.all(
        characterUrls.map((item: string) => fetchCharacter(item)),
      );

      const characters: Character[] = response as Character[];

      let filteredResponse: Character[];
      if (status?.title) {
        filteredResponse = characters.filter(
          character => character.status === status.title,
        );
      } else {
        filteredResponse = characters;
      }

      setFilteredCharacters(filteredResponse);
    } catch (error) {
      console.error('Error fetching character:', error);
    }
  }, [location, status]);

  const _fetchCharacters = useCallback(
    async (page: number, status: Status | undefined) => {
      try {
        if (page === 1) {
          setLoading(true);
        } else {
          setIsLoadingMore(true);
        }

        const data = await fetchCharacters(page, status?.value);

        setInfo(data.info);
        setCharacters(prevCharacters =>
          page === 1 ? data.results : [...prevCharacters, ...data.results],
        );
      } catch (error) {
        console.error('Error fetching characters:', error);
      } finally {
        setLoading(false);
        setIsLoadingMore(false);
      }
    },
    [],
  );

  const handleLoadMoreCharacters = useCallback(() => {
    if (info?.next) {
      setPage(prevPage => prevPage + 1);
      _fetchCharacters(page + 1, status);
    }
  }, [info, page, status, _fetchCharacters]);

  const getStatusColor = useCallback((status: string) => {
    return status === STATUS[0].title
      ? colors.green
      : status === STATUS[1].title
      ? colors.red
      : colors.gray.medium;
  }, []);

  const renderCharacterItem = useCallback(
    ({item}: {item: Character}) => (
      <View style={{...styles.item, borderColor: getStatusColor(item.status)}}>
        <View style={styles.characterImageContainer}>
          <Image source={{uri: item.image}} style={styles.characterImage} />
          <View
            style={{
              ...styles.characterStatusContainer,
              backgroundColor: getStatusColor(item.status),
            }}>
            <Text style={styles.characterStatusText}>{item.status}</Text>
          </View>
        </View>
        <View style={styles.characterInfoContainer}>
          <Text
            style={styles.characterName}
            numberOfLines={1}
            ellipsizeMode="tail">
            {item.name}
          </Text>
          <View>
            <Text style={styles.locationLabel}>Last known location:</Text>
            <Text style={styles.characterLocation}>{item.location.name}</Text>
          </View>
        </View>
      </View>
    ),
    [getStatusColor],
  );

  const renderHeader = useMemo(
    () => (
      <View style={styles.headerContainer}>
        <Text style={styles.totalCharacterCount}>
          {location
            ? `Total Characters ${filteredCharacters.length}`
            : `Total Characters: ${characters.length} / ${info?.count}`}
        </Text>
        <Badge
          visible={location !== undefined || status !== undefined}
          style={styles.badge}
          size={8}
        />
        <AntDesign
          onPress={handleOnFilterIcon}
          name="filter"
          size={24}
          color={colors.text.black}
        />
      </View>
    ),
    [
      filteredCharacters.length,
      characters.length,
      info?.count,
      location,
      status,
      handleOnFilterIcon,
    ],
  );

  const renderListEmptyComponent = useMemo(
    () => (
      <View style={styles.listEmptyComponent}>
        <Text style={styles.listEmptyComponentText}>No character found.</Text>
      </View>
    ),
    [],
  );

  const renderFilteredCharacterList = useMemo(
    () => (
      <FlatList
        key={2}
        numColumns={2}
        data={filteredCharacters}
        renderItem={renderCharacterItem}
        showsVerticalScrollIndicator={false}
        keyExtractor={item => item.id.toString()}
        ListEmptyComponent={renderListEmptyComponent}
      />
    ),
    [filteredCharacters, renderCharacterItem, renderListEmptyComponent],
  );

  const renderCharacterList = useMemo(
    () => (
      <FlatList
        key={2}
        numColumns={2}
        data={characters}
        renderItem={renderCharacterItem}
        showsVerticalScrollIndicator={false}
        keyExtractor={item => item.id.toString()}
        onEndReached={handleLoadMoreCharacters}
        onEndReachedThreshold={0.1}
        ListEmptyComponent={renderListEmptyComponent}
        ListFooterComponent={() =>
          isLoadingMore && (
            <ActivityIndicator animating={true} color={colors.gray.medium} />
          )
        }
      />
    ),
    [
      characters,
      handleLoadMoreCharacters,
      isLoadingMore,
      renderCharacterItem,
      renderListEmptyComponent,
    ],
  );

  if (loading && page === 1) {
    return <ActivityIndicator size="large" color={colors.gray.medium} />;
  }

  return (
    <View style={styles.container}>
      {renderHeader}
      {location ? renderFilteredCharacterList : renderCharacterList}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  headerContainer: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginHorizontal: 10,
    paddingRight: 10,
    marginBottom: 20,
  },
  totalCharacterCount: {
    fontSize: 20,
    fontWeight: '400',
  },
  badge: {
    position: 'absolute',
    top: -2,
    right: 6,
    backgroundColor: colors.red,
  },
  item: {
    flex: 1 / 2,
    height: 300,
    margin: 8,
    borderRadius: 15,
    flexDirection: 'column',
    justifyContent: 'space-between',
    borderWidth: 1,
    borderColor: '#178F51',
    backgroundColor: colors.gray.lighter,
  },
  characterImageContainer: {
    width: '100%',
    height: '60%',
  },
  characterImage: {
    width: '100%',
    height: '100%',
    borderTopLeftRadius: 15,
    borderTopRightRadius: 15,
  },
  characterStatusContainer: {
    top: 10,
    left: 10,
    borderRadius: 5,
    paddingVertical: 2,
    paddingHorizontal: 5,
    position: 'absolute',
    backgroundColor: colors.green,
  },
  characterStatusText: {
    fontWeight: 'bold',
    color: colors.text.white,
  },
  characterInfoContainer: {
    display: 'flex',
    height: '40%',
    paddingVertical: 5,
    paddingHorizontal: 10,
    borderBottomLeftRadius: 15,
    borderBottomRightRadius: 15,
    justifyContent: 'space-evenly',
  },
  characterName: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  locationLabel: {
    fontSize: 14,
    color: colors.gray.light,
    marginBottom: 3,
  },
  characterLocation: {
    fontSize: 15,
    fontWeight: '500',
    color: colors.gray.medium,
  },
  listEmptyComponent: {
    padding: 10,
    alignSelf: 'center',
  },
  listEmptyComponentText: {
    fontSize: 24,
    fontWeight: 'bold',
    color: colors.red,
  },
});

export default CharacterList;
