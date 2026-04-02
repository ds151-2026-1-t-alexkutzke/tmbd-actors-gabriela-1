import { useLocalSearchParams, useRouter } from 'expo-router';
import { useEffect, useState } from 'react';
import { View, Text, Image, ScrollView, TouchableOpacity, StyleSheet, ActivityIndicator } from 'react-native';
import { api } from '../../src/api/tmdb';

export default function ActorScreen() {
  const { id } = useLocalSearchParams();
  const router = useRouter();

  const [actor, setActor] = useState<any>(null);
  const [movies, setMovies] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchActorData = async () => {
      try {
        const [actorRes, moviesRes] = await Promise.all([
          api.get(`/person/${id}`),
          api.get(`/person/${id}/movie_credits`)
        ]);

        setActor(actorRes.data);
        setMovies(moviesRes.data.cast);
      } catch (error) {
        console.log('Erro ao buscar ator:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchActorData();
  }, [id]);

  if (isLoading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" color="#E50914" />
      </View>
    );
  }

  if (!actor) {
    return (
      <View style={styles.center}>
        <Text style={styles.errorText}>Ator não encontrado.</Text>
      </View>
    );
  }

  return (
    <ScrollView style={styles.container}>
      <Image
        source={{
          uri: actor.profile_path
            ? `https://image.tmdb.org/t/p/w500${actor.profile_path}`
            : 'https://via.placeholder.com/300x450'
        }}
        style={styles.image}
      />

      <View style={styles.content}>
        <Text style={styles.name}>{actor.name}</Text>

        <Text style={styles.sectionTitle}>Biografia</Text>
        <Text style={styles.bio}>
          {actor.biography || 'Biografia não disponível.'}
        </Text>

        <Text style={styles.sectionTitle}>Filmografia</Text>

        <ScrollView horizontal showsHorizontalScrollIndicator={false}>
          {movies.map(movie => (
            <TouchableOpacity
              key={movie.id}
              onPress={() => router.push(`/movie/${movie.id}`)}
            >
              <Image
                source={{
                  uri: movie.poster_path
                    ? `https://image.tmdb.org/t/p/w200${movie.poster_path}`
                    : 'https://via.placeholder.com/200x300'
                }}
                style={styles.poster}
              />
            </TouchableOpacity>
          ))}
        </ScrollView>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#121212' },
  center: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  content: { padding: 20 },
  image: { width: '100%', height: 400 },
  name: { color: '#FFFFFF', fontSize: 24, fontWeight: 'bold', marginBottom: 16 },
  sectionTitle: { color: '#FFFFFF', fontSize: 18, fontWeight: 'bold', marginBottom: 8 },
  bio: { color: '#D1D5DB', fontSize: 16, lineHeight: 24, marginBottom: 16 },
  poster: { width: 120, height: 180, marginRight: 10 },
  errorText: { color: '#FFFFFF', fontSize: 18 },
});
