#include <stdio.h>
#include <stdlib.h>
#include <stdbool.h>

int main()
{
	while(true){
		int i, number, modulo, exponent, exponentAux;
		printf("Write a Number\n");
		scanf("%d", &number);

		printf("Write an exponent\n");
		scanf("%d", &exponent);

		printf("Write a modulo\n");
		scanf("%d", &modulo);
		unsigned long long result = number % modulo;
		for (i = 0; i < exponent - 1; i++)
		{
			result = (result * number) % modulo;
		}

		printf("Your Result: %llu \n =======================\n Press any key to continue...\n", result);
		getchar(); 
		getchar();

	}
	return 0;
}