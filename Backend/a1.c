#include <stdio.h>
#include <string.h>

char xorfun(char *encoded, char *crc)
{
    int crclen = strlen(crc);

    for (int i = 0; i <= (strlen(encoded) - crclen);)
    {
        for (int j = 0; j < crclen; j++)
        {
            encoded[i + j] = (encoded[i + j] == crc[j]) ? '0' : '1';
        }
        for (; i < strlen(encoded) && encoded[i] != '1'; i++)
            ;
    }
    return *encoded;
}
int main()
{
    char data[100], crc[100], encoded[200];
    printf("Enter Data bits: \n");
    scanf("%s", data);
    printf("Enter Generator: \n");
    scanf("%s", crc);

    strcpy(encoded, data);
    int datalen = strlen(data);
    int crclen = strlen(crc);

    for (int i = 1; i <= (crclen - 1); i++)
        strcat(encoded, "0");

    xorfun(encoded, crc);

    printf("Checksum generated is: ");
    printf("%s\n\n", encoded + strlen(encoded) - crclen + 1);
    printf("Message to be Transmitted over network: ");
    printf("%s%s", data, encoded + strlen(encoded) - crclen + 1);
    printf("\nEnter the message received: \n");
    char msg[200];
    scanf("%s", msg);

    xorfun(msg, crc);

    for (int i = strlen(msg) - crclen + 1; i < strlen(msg); i++)
        if (msg[i] != '0')
        {
            printf("Error in communication \n");
            return 0;
        }

    printf("No Error!\n");
    return 0;
}



#include <stdio.h>
#include <math.h>
#include <string.h>

int check_parity(int n, int i, int code[])
{
    int p = 0, k;
    for (int j = i; j <= n; j = k + i)
    {
        for (k = j; k < j + i && k <= n; k++)
        {
            if (code[k] == 1)
                p++;
        }
    }
    if (p % 2 == 0)
        return 0;
    else
        return 1;
}

void hamming_code(int data[], int num)
{
    int r = 0, m = 0, n, j = 1, c, code[50];

    while ((r + num + 1) > (pow(2, r)))
        r++;

    n = num + r;
    for (int i = 1; i <= n; i++)
    {
        if (i == (int)pow(2, m) && m <= r)
        {
            code[i] = 0;
            m++;
        }
        else
        {
            code[i] = data[j];
            j++;
        }
    }

    m = 0;
    for (int i = 1; i <= n; i++)
    {
        if (i == (int)pow(2, m) && m <= r)
        {
            c = check_parity(n, i, code);
            code[i] = c;
            m++;
        }
    }

    printf("The hamming code is:");
    for (int i = n; i > 0; i--)
        printf("%d", code[i]);
    printf("\nEnter received code:");
    for (int i = n; i > 0; i--)
        scanf("%d", &code[i]);
    m = j = c = 0;
    for (int i = 1; i <= n; i++)
    {
        if (i == (int)pow(2, m) && m <= r)
        {
            c = c + ((int)pow(2, j) * check_parity(n, i, code));
            j++;
            m++;
        }
    }
    if (c == 0)
        printf("\nReceived word is correct.");
    else
    {
        printf("\nError in bit %d\nThe corrected one is ", (n - c) + 1);
        if (code[c] == 1)
            code[c] = 0;
        else
            code[c] = 1;
        for (int i = n; i > 0; i--)
            printf("%d", code[i]);
    }
}

int main()
{
    int data[50], num;

    printf("Enter the size of data");
    scanf("%d", &num);
    printf("Enter the data:");
    for (int i = num; i > 0; i--)
        scanf("%d", &data[i]);

    hamming_code(data, num);
    printf("we had done the hamming code practical 10 in DC\n");
    return 0;
}

