import type { CountriesEnum } from '#gql/default';
import { countries } from '#constants';

export const useCountry = () => {
    // State to store allowed countries
    const allowedCountries = useState<CountriesEnum[] | null>('allowedCountries', () => null);
    const isLoadingAllowedCountries = useState<boolean>('isLoadingAllowedCountries', () => false);

    // State to store the countries to be shown - init with static countries
    const countriesToShow = useState<GeoLocation[]>('countriesToShow', () => countries);

    // State to store states for each country state
    const countryStatesDict = useState<{ [code: string]: GeoLocation[] }>('countryStatesDict', () => ({}));
    const isLoadingCountryStates = useState<{ [code: string]: boolean }>('isLoadingCountryStates', () => ({}));

    // Function to get allowed countries from API
    async function getAllowedCountries() {
        if (allowedCountries.value || isLoadingAllowedCountries.value) {
            return;
        }

        isLoadingAllowedCountries.value = true;

        try {
            const response = await GqlGetAllowedCountries();
            if (response.allowedCountries) {
                // Filter out null values and store the result
                allowedCountries.value = response.allowedCountries.filter(
                    (country): country is CountriesEnum => country !== null
                );

                // Filter countries to show based on allowed countries
                countriesToShow.value = countries.filter(
                    (country) => allowedCountries.value?.includes(country.code as CountriesEnum)
                );
            }
        } catch (error) {
            console.error('Failed to retrieve allowed countries', error);
        } finally {
            isLoadingAllowedCountries.value = false;
        }
    }

    // Function to get states for a specific country from API - once
    async function getStatesForCountry(countryCode: CountriesEnum) {
        if (countryStatesDict.value[countryCode] || isLoadingCountryStates.value[countryCode]) {
            return;
        }

        isLoadingCountryStates.value[countryCode] = true;

        try {
            const { countryStates } = await GqlGetStates({ country: countryCode });
            if (countryStates) {
                countryStatesDict.value[countryCode] = countryStates as GeoLocation[];
            }
        } catch (error) {
            console.error(`Failed to retrieve states for country ${countryCode}`, error);
        } finally {
            isLoadingCountryStates.value[countryCode] = false;
        }
    }

    return {
        getAllowedCountries,
        countriesToShow,
        getStatesForCountry,
        countryStatesDict,
    };
};
