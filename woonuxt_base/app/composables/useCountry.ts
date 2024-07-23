import type { CountriesEnum } from '#gql/default';
import { countries } from '#constants';

export const useCountry = () => {
    const allowedCountries = useState<CountriesEnum[] | null>('allowedCountries', () => null);
    const isLoadingAllowedCountries = useState<boolean>('isLoadingAllowedCountries', () => false);
    
    const countriesToShow = useState<GeoLocation[]>('countriesToShow', () => countries);

    const countryStatesDict = useState<{ [code: string]: GeoLocation[] }>('countryStatesDict', () => ({}));
    const isLoadingCountryStates = useState<{ [code: string]: boolean }>('isLoadingCountryStates', () => ({}));

    async function getAllowedCountries() {
        if (allowedCountries.value || isLoadingAllowedCountries.value) {
            return;
        }

        isLoadingAllowedCountries.value = true;

        try {
            const response = await GqlGetAllowedCountries();
            if (response.allowedCountries) {
                allowedCountries.value = (response.allowedCountries).filter((country): country is CountriesEnum => country !== null);
                countriesToShow.value = countries.filter((country) => allowedCountries.value?.includes(country.code as CountriesEnum))
            }
        } catch (error) {
            console.error('Failed to retrieve allowed countries', error);
        } finally {
            isLoadingAllowedCountries.value = false;
        }
    }

    async function getStatesForCountry(countryCode: CountriesEnum) {
        if (countryStatesDict.value[countryCode] || isLoadingCountryStates.value[countryCode]) {
            return;
        }

        isLoadingCountryStates.value[countryCode.toString()] = true;

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
